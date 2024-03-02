import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDOwc50cymmTWAxtgWb_J5hMgC5jy148HQ",
  authDomain: "testdata-1f2fb.firebaseapp.com",
  projectId: "testdata-1f2fb",
  storageBucket: "testdata-1f2fb.appspot.com",
  messagingSenderId: "637957642472",
  appId: "1:637957642472:web:dff8935175642390b4515d"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();