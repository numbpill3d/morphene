// js/setup-data.js
// Sample data setup for Void Avatar Lounge
// Run this once to populate Firestore with sample items

import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Sample items data
const sampleItems = [
  // Base Body
  {
    id: "base_default",
    displayName: "Base Shell",
    category: "baseBody",
    slot: "baseBody",
    rarity: "common",
    z: 10,
    src: "assets/body/base_default.svg",
    layers: [
      { src: "assets/body/base_default.svg", z: 10 }
    ]
  },
  
  // Eyes
  {
    id: "eyes_default",
    displayName: "Default Eyes",
    category: "eyes",
    slot: "eyes",
    rarity: "common",
    z: 30,
    src: "assets/eyes/eyes_default.svg",
    layers: [
      { src: "assets/eyes/eyes_default.svg", z: 30 }
    ]
  },
  
  // Hair
  {
    id: "hair_001",
    displayName: "Black Hair",
    category: "hair",
    slot: "hair",
    rarity: "common",
    z: 20,
    src: "assets/hair/hair_001.svg",
    layers: [
      { src: "assets/hair/hair_001.svg", z: 20 }
    ]
  },
  {
    id: "hair_002",
    displayName: "Red Hair",
    category: "hair",
    slot: "hair",
    rarity: "uncommon",
    z: 20,
    src: "assets/hair/hair_002.svg",
    layers: [
      { src: "assets/hair/hair_002.svg", z: 20 }
    ]
  },
  
  // Tops
  {
    id: "top_001",
    displayName: "Black Tee",
    category: "top",
    slot: "top",
    rarity: "common",
    z: 40,
    src: "assets/top/top_001.svg",
    layers: [
      { src: "assets/top/top_001.svg", z: 40 }
    ]
  },
  {
    id: "top_002",
    displayName: "Red Hoodie",
    category: "top",
    slot: "top",
    rarity: "uncommon",
    z: 40,
    src: "assets/top/top_002.svg",
    layers: [
      { src: "assets/top/top_002.svg", z: 40 }
    ]
  },
  
  // Bottoms
  {
    id: "bottom_001",
    displayName: "Blue Jeans",
    category: "bottom",
    slot: "bottom",
    rarity: "common",
    z: 50,
    src: "assets/bottom/bottom_001.svg",
    layers: [
      { src: "assets/bottom/bottom_001.svg", z: 50 }
    ]
  },
  {
    id: "bottom_002",
    displayName: "Black Pants",
    category: "bottom",
    slot: "bottom",
    rarity: "common",
    z: 50,
    src: "assets/bottom/bottom_002.svg",
    layers: [
      { src: "assets/bottom/bottom_002.svg", z: 50 }
    ]
  },
  
  // Accessories
  {
    id: "acc_001",
    displayName: "Gold Chain",
    category: "accessory1",
    slot: "accessory1",
    rarity: "uncommon",
    z: 35,
    src: "assets/accessories/acc_001.svg",
    layers: [
      { src: "assets/accessories/acc_001.svg", z: 35 }
    ]
  },
  {
    id: "acc_002",
    displayName: "Silver Ring",
    category: "accessory2",
    slot: "accessory2",
    rarity: "rare",
    z: 60,
    src: "assets/accessories/acc_002.svg",
    layers: [
      { src: "assets/accessories/acc_002.svg", z: 60 }
    ]
  }
];

export async function setupSampleData() {
  console.log("Setting up sample data for Void Avatar Lounge...");
  
  // Add all sample items to the items collection
  for (const item of sampleItems) {
    const itemRef = doc(db, "items", item.id);
    await setDoc(itemRef, item);
    console.log(`Added item: ${item.displayName}`);
  }
  
  console.log("Sample data setup complete!");
  console.log("Next steps:");
  console.log("1. Create placeholder PNG images in assets/ folders");
  console.log("2. Update js/firebase-init.js with your Firebase config");
  console.log("3. Test the application flow");
}

// Call this function to set up data
// setupSampleData();