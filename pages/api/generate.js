import { getData, addData, db } from "./firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { Body } from "node-fetch";
import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

let allowRequest = true;
let docRef;

export async function checkRequestMax(requestUid) {
  const today = new Date().toLocaleDateString();
  let anonRequests = 0;
  let userRequests = 0;

  // Checks request if user is "Anonymous"
  if (requestUid === "Anonymous") {
    docRef = doc(db, "lessons", "Vxhsl1Y6lZdMndTexmPU");
    let docSnap = await getDoc(docRef);
    let document = docSnap.data();
    for (let i = 0; i < document.generatedLessons.length; i++) {
      const time = document.generatedLessons[i].timestamp;
      const date = new Date(time.seconds * 1000).toLocaleDateString("en-US");
      if (date == today) {
        anonRequests++;
      }
    }
    if (anonRequests > 29) {
      allowRequest = false;
    }
  }
  // Checks request if user is logged in
  else {
    const allDocuments = await getData();
    for (let i = 0; i < allDocuments.length; i++) {
      if (allDocuments[i].uid === requestUid) {
        docRef = doc(db, "lessons", allDocuments[i].docId);
        for (let e = 0; e < allDocuments[i].generatedLessons.length; e++) {
          const time = allDocuments[i].generatedLessons[e].timestamp;
          const date = new Date(time.seconds * 1000).toLocaleDateString(
            "en-US"
          );
          if (date == today) {
            userRequests++;
          }
        }
      }
    }
    if (userRequests > 9) {
      allowRequest = false;
    }
  }
}

// Checks that client input data doesn't exeedes allowed maximum
function checkRequestLength(reqGrade, reqSubject, reqTheme) {
  if (reqGrade.length > 50 || reqSubject.length > 40 || reqTheme.length > 40) {
    allowRequest = false;
  }
}

// Request to moderation to filter inappropriate content
async function contenFilter(resp) {
  const filterResponse = await openai.moderations
    .create({ input: resp })
    .catch((error) => {
      console.log(error);
    });
  return filterResponse.results[0].flagged;
}

// Concatenates string for openAI request
function generatePrompt(grade, subject, theme) {
  return `A detailed lesson plan for a ${grade} class, subject ${subject}, lesson${theme}`;
}

export default async function openAiCreate(req, res) {
  const body = await req.json();

  await checkRequestMax(body.uid);
  checkRequestLength(
    body.generatedLesson.grade,
    body.generatedLesson.subject,
    body.generatedLesson.lesson
  );
  if (allowRequest === true) {
    const temperature = body.generatedLesson.randomness / 100;
    const model = body.generatedLesson.model;
    const initialPrompt = generatePrompt(
      body.generatedLesson.grade,
      body.generatedLesson.subject,
      body.generatedLesson.lesson
    );

    const completion = await openai.chat.completions
      .create({
        model: model,
        messages: [{ role: "user", content: initialPrompt }],
        stream: true,
        temperature: temperature,
        top_p: 1,
        max_tokens: 800,
      })
      .catch((error) => {
        console.log(error);
      });

    let response = "";

    for await (const chunk of completion) {
      if (chunk.choices[0].delta.content) {
        response = response + chunk.choices[0].delta.content;
      }
    }
    // const response = completion.choices[0].message.content;

    const filterL = await contenFilter(response);

    // Checks if response contains inappropriate content based on contentFilter()
    if (filterL == false) {
      const userData = {
        uid: body.uid,
        displayName: body.displayName,
        email: body.email,
        photoURL: body.photoURL,
      };
      const lessonData = {
        lessonTitle: body.generatedLesson.lesson,
        subject: body.generatedLesson.subject,
        grade: body.generatedLesson.grade,
        generatedLesson: response,
      };
      addData(lessonData, userData, docRef);
      return Response.json({ result: response });
    } else {
      res
        .status(200)
        .json({ result: "Please try again by modifying the input." });
    }
  } else {
    res.status(200).json({
      result:
        "Sorry, the maximum number of requests for today has been reached. Please sign in or try again tomorrow.",
    });
  }
}
