import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtSu9PQoG_m0Jn7CFuWJUBHgtH19qghM0",
  authDomain: "lessonarchitect-auth.firebaseapp.com",
  projectId: "lessonarchitect-auth",
  storageBucket: "lessonarchitect-auth.appspot.com",
  messagingSenderId: "221360620840",
  appId: "1:221360620840:web:b8d1caced49c3702a5fc1d",
  measurementId: "G-FVQ7DEFD1Q",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    let user = await signInWithPopup(auth, provider);
    console.log(user);
  } catch (error) {
    console.log(error);
  }
}
