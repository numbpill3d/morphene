// config/firebase.js
// Centralized Firebase CDN URLs and version

export const FIREBASE_VERSION = "10.12.0";
export const FIREBASE_BASE_URL = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

export const FIREBASE_URLS = {
  app: `${FIREBASE_BASE_URL}/firebase-app.js`,
  auth: `${FIREBASE_BASE_URL}/firebase-auth.js`,
  firestore: `${FIREBASE_BASE_URL}/firebase-firestore.js`,
  storage: `${FIREBASE_BASE_URL}/firebase-storage.js`,
};