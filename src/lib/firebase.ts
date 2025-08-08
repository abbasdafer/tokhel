// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "tokhel-ink",
  "appId": "1:432216431757:web:7d70c0a9520c80b49216c4",
  "storageBucket": "tokhel-ink.appspot.com",
  "apiKey": "AIzaSyD425s72L16DUUZjMmHb0Y3MhWkfNzk9XM",
  "authDomain": "tokhel-ink.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "432216431757"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
