This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# LessonArchitect

LessonArchitect is an application built with Next.js, React and MUI that makes use of the OpenAI API to facilitate the creation of lesson plans and the Firebase SDK for user authentication and database.

## Live Project

The live version of the project can be found here: https://lessonarchitect.vercel.app/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before running the app, you will need to add your own Firebase credentials. To do this, create a new Firebase project at https://firebase.google.com/ and select the “Add Firebase to your web app” option.  Replace the firebase options in the files `pages/api/firebase-config.js` and `components/login.js` with your own credentials.

Additionally, you will need to acquire a private key from OpenAI at https://openai.com/ and create an environment variable.  Replace the variable at the file `pages/api/generate.js`.

### Installing

Once the credentials are set, you can install all the necessary dependencies by running `npm install` from the root directory of the project.

Once the dependencies are installed, you can start up the development server by running `npm run dev` from the root directory.

## Built With

* [Next.js](https://nextjs.org/) - The web framework used
* [React](https://reactjs.org/) - Front end library
* [MUI](https://www.material-ui.com/) - UI framework
* [OpenAI](https://openai.com/) - AI platform
* [Firebase](https://firebase.google.com/) - Database and authentication

## Authors

* **Eddy S** (https://eddysanchez.dev)
