import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  arrayUnion,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfigServer = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "lessonarchitect.firebaseapp.com",
  projectId: "lessonarchitect",
  storageBucket: "lessonarchitect.appspot.com",
  messagingSenderId: "197251585735",
  appId: "1:197251585735:web:85f7712d62522981c050e2",
  measurementId: "G-9D5CZ7DCKV",
};

const appTwo = initializeApp(firebaseConfigServer, "lessonArchitect");
const db = getFirestore(appTwo);
const storiesCollectionRef = collection(db, "lessons");

export default async function getClientData(req, res) {
  if (req.method === "GET") {
    const data = await getDocs(storiesCollectionRef);
    const dataObject = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    res.status(200).json(dataObject);
  }
}

export async function addData(storyData, userId) {
  const documents = await getData();
  console.log(documents);
  for (let i = 0; i < documents.length; i++) {
    if (userId === "null") {
      let docRef = doc(db, "lessons", Vxhsl1Y6lZdMndTexmPU);
      console.log("ney mamey");
      updateDoc(docRef, {
        generatedLessons: arrayUnion(storyData),
      });
    } else if (documents[i].uid === userId) {
      let docRef = doc(db, "lessons", documents[i].docId);
      console.log("yey hawuei");
      updateDoc(docRef, {
        generatedLessons: arrayUnion(storyData),
      });
    }
  }
}

export async function getData() {
  const data = await getDocs(storiesCollectionRef);
  console.log(data.docs);
  const response = data.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
  console.log("response--------------", response);
  return response;
}
