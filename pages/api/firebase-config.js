import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfigServer = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "little-fiction-db.firebaseapp.com",
  projectId: "little-fiction-db",
  storageBucket: "little-fiction-db.appspot.com",
  messagingSenderId: "575224040852",
  appId: "1:575224040852:web:c966d9b16ca85711191381",
  measurementId: "G-HM6J59Y6KS",
};

const appTwo = initializeApp(firebaseConfigServer, "serverConfig");
const db = getFirestore(appTwo);
const storiesCollectionRef = collection(db, "stories");

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

export function addData(storyData) {
  addDoc(storiesCollectionRef, { timestamp: serverTimestamp(), ...storyData });
}

export async function getData() {
  const data = await getDocs(storiesCollectionRef);
  const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return response;
}
