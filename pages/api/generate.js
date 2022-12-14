import { Configuration, OpenAIApi } from "openai";
import { addData, getData } from "./firebase-config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let allowRequest = true;

// Checks and limits the maximum number of requests per day
async function checkRequestMax(userid) {
  const data = await getData();
  const today = new Date().toLocaleDateString();
  let allRequests = 0;
  let userRequests = 0;

  for (let d = 0; d < data.length; d++) {
    const time = data[d].timestamp;
    const date = new Date(time.seconds * 1000).toLocaleDateString("en-US");
    if (date == today) {
      allRequests++;
      if (userid !== "null" && data[d].uid === userid) {
        userRequests++;
      }
    }
  }

  if (userid === "null" && allRequests >= 10) {
    allowRequest = false;
  } else if (allRequests >= 30 || userRequests >= 5) {
    allowRequest = false;
  }
}

// Checks that client input data doesn't exeedes allowed maximum
function checkRequestLength(reqGrade, reqSubject, reqTheme) {
  if (reqGrade.length > 50 || reqSubject.length > 25 || reqTheme.length > 25) {
    allowRequest = false;
  }
}

// Request to content-filter-alpha to filter inappropriate content
async function contenFilter(resp) {
  const filterResponse = await openai
    .createCompletion({
      model: "content-filter-alpha",
      prompt: `<|endoftext|>${resp}\n--\nLabel:`,
      max_tokens: 1,
      temperature: 0,
      top_p: 0,
      logprobs: 10,
    })
    .catch((error) => {});
  return filterResponse.data["choices"][0]["text"];
}

// Concatenates string for openAI request
function generatePrompt(grade, subject, theme) {
  return `A lesson plan for a ${grade} class, subject ${subject}, lesson${theme}\n`;
}

export default async function openAiCreate(req, res) {
  await checkRequestMax(req.body.uid);
  checkRequestLength(
    req.body.generatedLesson.grade,
    req.body.generatedLesson.subject,
    req.body.generatedLesson.lesson
  );
  if (allowRequest === true) {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generatePrompt(
        req.body.generatedLesson.grade,
        req.body.generatedLesson.subject,
        req.body.generatedLesson.lesson
      ),
      temperature: req.body.generatedLesson.randomness / 100,
      top_p: 1,
      max_tokens: 600,
    });
    const response = completion.data.choices[0].text;
    const filterL = await contenFilter(response);

    // Checks if response contains inappropriate content based on contentFilter()
    if (filterL == "0" || filterL == "1") {
      const lessonData = {
        lessonTitle: req.body.generatedLesson.lesson,
        subject: req.body.generatedLesson.subject,
        grade: req.body.generatedLesson.grade,
        generatedLesson: response,
      };
      addData(lessonData, req.body.uid);
      res.status(200).json({ result: response });
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
