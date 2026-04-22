// js/firebase-init.js
// Firebase configuration for MORPHENE

import { FIREBASE_URLS } from "../config/firebase.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBekQsjCebnW8d-EtZAmbNypMSJych-JGQ",
  authDomain: "morphene-d5eb0.firebaseapp.com",
  projectId: "morphene-d5eb0",
  storageBucket: "morphene-d5eb0.firebasestorage.app",
  messagingSenderId: "1071351657264",
  appId: "1:1071351657264:web:061e070a00bc30d6794ef5",
  measurementId: "G-RHZ2KYY7SX"
};

// Dynamically import Firebase modules from CDN to avoid build step
const firebaseApp = await import(FIREBASE_URLS.app);
const firebaseAuth = await import(FIREBASE_URLS.auth);
const firebaseFirestore = await import(FIREBASE_URLS.firestore);
const firebaseStorage = await import(FIREBASE_URLS.storage);

// Initialize Firebase services
const app = firebaseApp.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(app);
const db = firebaseFirestore.getFirestore(app);
const storage = firebaseStorage.getStorage(app);

// Export Firebase services
export { auth, db, storage };

// Export Firebase functions
export const {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = firebaseAuth;

export const {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
} = firebaseFirestore;

// Export default app instance
export default app;
