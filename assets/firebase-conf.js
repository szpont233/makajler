// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  limit
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4_yXWVorjyQHf5OMIoXTUpfcyy7sJPyE",
  authDomain: "guestbook-imperium.firebaseapp.com",
  projectId: "guestbook-imperium",
  storageBucket: "guestbook-imperium.firebasestorage.app",
  messagingSenderId: "780071024560",
  appId: "1:780071024560:web:3ff011266cd83f7bd60875",
  measurementId: "G-665V4Q0410"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  limit
};
