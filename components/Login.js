import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxXaLWd1jhnpVICGBLYIczypN54NferlE",
  authDomain: "little-fiction.firebaseapp.com",
  projectId: "little-fiction",
  storageBucket: "little-fiction.appspot.com",
  messagingSenderId: "489385294877",
  appId: "1:489385294877:web:0387e71cc07a529436daf4",
  measurementId: "G-CVD3TDSZNS",
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
