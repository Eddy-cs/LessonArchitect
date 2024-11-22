import { getData, addData, db } from "./firebase-config";
import { getDoc, doc } from "firebase/firestore";
import OpenAI from "openai";

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

let allowRequest = true;
let docRef;

// Base class demonstrating encapsulation with private fields
class Lesson {
  #grade;
  #subject;
  #theme;

  constructor(grade, subject, theme) {
    this.#grade = grade;
    this.#subject = subject;
    this.#theme = theme;
  }

  // Protected method for inheritance
  _validateLength() {
    return this.#grade.length <= 50 &&
        this.#subject.length <= 40 &&
        this.#theme.length <= 40;
  }

  // Getters demonstrate encapsulation
  get grade() { return this.#grade; }
  get subject() { return this.#subject; }
  get theme() { return this.#theme; }

  // Polymorphic method that derived classes can override
  generatePrompt() {
    return `A detailed lesson plan for a ${this.#grade} class, subject ${this.#subject}, lesson${this.#theme}`;
  }
}

// Derived class demonstrating inheritance
class GeneratedLesson extends Lesson {
  #response;
  #temperature;

  constructor(grade, subject, theme, temperature) {
    super(grade, subject, theme);
    this.#temperature = temperature;
    this.#response = "";
  }

  // Polymorphic override of base method
  generatePrompt() {
    return `Create a detailed and engaging lesson plan for a ${this.grade} class, subject ${this.subject}, lesson${this.theme}`;
  }

  setResponse(response) {
    this.#response = response;
  }

  get response() { return this.#response; }
  get temperature() { return this.#temperature; }
}

export async function checkRequestMax(requestUid) {
  const today = new Date().toLocaleDateString();
  let anonRequests = 0;
  let userRequests = 0;

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
  } else {
    const allDocuments = await getData();
    for (let i = 0; i < allDocuments.length; i++) {
      if (allDocuments[i].uid === requestUid) {
        docRef = doc(db, "lessons", allDocuments[i].docId);
        for (let e = 0; e < allDocuments[i].generatedLessons.length; e++) {
          const time = allDocuments[i].generatedLessons[e].timestamp;
          const date = new Date(time.seconds * 1000).toLocaleDateString("en-US");
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

async function contenFilter(resp) {
  const filterResponse = await openai.moderations
      .create({ input: resp })
      .catch((error) => {
        console.log(error);
      });
  return filterResponse.results[0].flagged;
}

export default async function openAiCreate(req, res) {
  await checkRequestMax(req.body.uid);

  const generatedLesson = new GeneratedLesson(
      req.body.generatedLesson.grade,
      req.body.generatedLesson.subject,
      req.body.generatedLesson.lesson,
      req.body.generatedLesson.randomness / 100
  );

  // Use class method for validation
  allowRequest = generatedLesson._validateLength();

  if (allowRequest === true) {
    const model = req.body.generatedLesson.model;
    // Use polymorphic method
    const initialPrompt = generatedLesson.generatePrompt();

    const completion = await openai.chat.completions
        .create({
          model: model,
          messages: [{ role: "user", content: initialPrompt }],
          stream: true,
          temperature: generatedLesson.temperature,
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

    generatedLesson.setResponse(response);
    const filterL = await contenFilter(generatedLesson.response);

    if (filterL == false) {
      const userData = {
        uid: req.body.uid,
        displayName: req.body.displayName,
        email: req.body.email,
        photoURL: req.body.photoURL,
      };
      const lessonData = {
        lessonTitle: generatedLesson.theme,
        subject: generatedLesson.subject,
        grade: generatedLesson.grade,
        generatedLesson: generatedLesson.response,
      };
      addData(lessonData, userData, docRef);
      res.status(200).json({ result: generatedLesson.response });
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