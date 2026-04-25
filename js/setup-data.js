// js/setup-data.js
// Seed all items to Firestore. Paste this file's contents into the browser
// console while logged in, or import and call setupSampleData() once.

import { db, setDoc, doc } from "./firebase-init.js";
import { FALLBACK_ITEMS } from "../config/app.js";

export async function setupSampleData() {
  console.log("seeding items to firestore...");
  for (const [id, item] of Object.entries(FALLBACK_ITEMS)) {
    await setDoc(doc(db, "items", id), { ...item, id });
    console.log(`  + ${id}`);
  }
  console.log("done.");
}

// setupSampleData();
