// assets/firebase-auth.js
import { initializeApp, getApps, getApp } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-wIxTuqRapc26UAKHOXatoADONeHzdAc",
  authDomain: "lechlogin.firebaseapp.com",
  projectId: "lechlogin",
  storageBucket: "lechlogin.firebasestorage.app",
  messagingSenderId: "1000327677896",
  appId: "1:1000327677896:web:d146b03843b967b056a2fd"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
