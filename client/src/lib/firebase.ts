import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";

// 1. PRIMA LA CONFIGURAZIONE
const firebaseConfig = {
  apiKey: "AIzaSyDZfJrQrB7RDL4et_ByI6RPZe8MerwmVn8",
  authDomain: "ecomaker-8f9ac.firebaseapp.com",
  projectId: "ecomaker-8f9ac",
  storageBucket: "ecomaker-8f9ac.firebasestorage.app",
  messagingSenderId: "912951616099",
  appId: "1:912951616099:web:d6f54f2f0a41bccee18e56",
  measurementId: "G-ND6VC80NRT"
};

// 2. POI L'INIZIALIZZAZIONE
const app = initializeApp(firebaseConfig);

// 3. INFINE GLI EXPORT
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);