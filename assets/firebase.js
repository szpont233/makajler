import { initializeApp, getApps } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4_yXWVorjyQHf5OMIoXTUpfcyy7sJPyE",
  authDomain: "guestbook-imperium.firebaseapp.com",
  projectId: "guestbook-imperium",
  storageBucket: "guestbook-imperium.firebasestorage.app",
  messagingSenderId: "780071024560",
  appId: "1:780071024560:web:3ff011266cd83f7bd60875",
  measurementId: "G-665V4Q0410"
};
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
