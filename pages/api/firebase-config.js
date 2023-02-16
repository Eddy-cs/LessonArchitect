import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  arrayUnion,
  getDocs,
  updateDoc,
  Timestamp,
  addDoc,
  getDoc,
  doc,
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
export const db = getFirestore(appTwo);
const lessonsCollectionRef = collection(db, "lessons");

export default async function getClientData(req, res) {
  if (req.method === "GET") {
    let docRef = doc(db, "lessons", "Vxhsl1Y6lZdMndTexmPU");
    let docSnap = await getDoc(docRef);
    let document = docSnap.data();
    res.status(200).json(document);
  }
}

// Adds lesson to user array of 'generatedLessons' if user exists
// creates new user data if it doesn't
export async function addData(lessonData, userData, docRef) {
  if (docRef) {
    updateDoc(docRef, {
      generatedLessons: arrayUnion({
        ...lessonData,
        timestamp: Timestamp.now(),
      }),
    });
  } else if (userData.uid) {
    addDoc(lessonsCollectionRef, {
      ...userData,
      timestamp: Timestamp.now(),
      generatedLessons: [lessonData],
    });
  }
}

export async function getData() {
  const data = await getDocs(lessonsCollectionRef);
  const response = data.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
  return response;
}
