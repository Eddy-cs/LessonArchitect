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
const LESSON_DOC_ID = "Vxhsl1Y6lZdMndTexmPU";

export async function addData(lessonData, userData, docRef) {
  if (docRef) {
    await updateDoc(docRef, {
      generatedLessons: arrayUnion({
        ...lessonData,
        timestamp: Timestamp.now(),
      }),
    });
  } else if (userData.uid) {
    await addDoc(lessonsCollectionRef, {
      ...userData,
      timestamp: Timestamp.now(),
      generatedLessons: [lessonData],
    });
  }
}

export async function getData() {
  const data = await getDocs(lessonsCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
}

async function handler(req, res) {
  const docRef = doc(db, "lessons", LESSON_DOC_ID);

  try {
    switch (req.method) {
      case 'GET':
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          return res.status(404).json({ error: 'Document not found' });
        }
        return res.status(200).json(docSnap.data());

      case 'PUT':
        const { originalLesson, newTitle } = req.body;
        const putDocSnap = await getDoc(docRef);
        const putData = putDocSnap.data();

        if (!putData?.generatedLessons) {
          return res.status(404).json({ error: 'Lessons not found' });
        }

        const updatedLessons = putData.generatedLessons.map(lesson =>
            lesson.timestamp.seconds === originalLesson.timestamp.seconds
                ? { ...lesson, lessonTitle: newTitle }
                : lesson
        );

        await updateDoc(docRef, { generatedLessons: updatedLessons });
        return res.status(200).json(updatedLessons);

      case 'DELETE':
        const { lessonToDelete } = req.body;
        const deleteDocSnap = await getDoc(docRef);
        const deleteData = deleteDocSnap.data();

        if (!deleteData?.generatedLessons) {
          return res.status(404).json({ error: 'Lessons not found' });
        }

        const remainingLessons = deleteData.generatedLessons.filter(lesson =>
            lesson.timestamp.seconds !== lessonToDelete.timestamp.seconds
        );

        await updateDoc(docRef, { generatedLessons: remainingLessons });
        return res.status(200).json(remainingLessons);

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default handler;