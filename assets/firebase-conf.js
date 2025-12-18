  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB4_yXWVorjyQHf5OMIoXTUpfcyy7sJPyE",
    authDomain: "guestbook-imperium.firebaseapp.com",
    projectId: "guestbook-imperium",
    storageBucket: "guestbook-imperium.firebasestorage.app",
    messagingSenderId: "780071024560",
    appId: "1:780071024560:web:3ff011266cd83f7bd60875",
    measurementId: "G-665V4Q0410"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
