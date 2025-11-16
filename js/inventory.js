// js/inventory.js

import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");
const inventoryGrid = document.getElementById("inventory-grid");
const inventoryEmpty = document.getElementById("inventory-empty");
const equippedSummary = document.getElementById("equipped-summary");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userEmailEl.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    userCoinsEl.textContent = userSnap.data().coins ?? 0;
  } else {
    userCoinsEl.textContent = "0";
  }

  await loadInventory(user.uid);
  await loadEquippedSummary(user.uid);
});

async function loadInventory(uid) {
  inventoryGrid.innerHTML = "";
  const invCol = collection(db, "users", uid, "inventory");
  const invSnap = await getDocs(invCol);

  if (invSnap.empty) {
    inventoryEmpty.style.display = "block";
    return;
  } else {
    inventoryEmpty.style.display = "none";
  }

  for (const docSnap of invSnap.docs) {
    const itemId = docSnap.id;
    const itemRef = doc(db, "items", itemId);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) continue;
    const item = itemSnap.data();

    const card = document.createElement("div");
    card.className = "inventory-card";

    const header = document.createElement("div");
    header.className = "inventory-card-header";
    const nameSpan = document.createElement("span");
    nameSpan.className = "inventory-card-name";
    nameSpan.textContent = item.displayName || itemId;
    const catSpan = document.createElement("span");
    catSpan.className = "inventory-card-cat";
    catSpan.textContent = item.category || "misc";
    header.appendChild(nameSpan);
    header.appendChild(catSpan);

    const meta = document.createElement("div");
    meta.textContent = `rarity: ${item.rarity || "common"} / slot: ${item.slot || item.category || "body"}`;

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "equip";
    btn.addEventListener("click", async () => {
      await equipItem(uid, item, itemId);
      await loadEquippedSummary(uid);
      alert(`equipped ${item.displayName || itemId}`);
    });

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(btn);
    inventoryGrid.appendChild(card);
  }
}

async function equipItem(uid, item, itemId) {
  const equippedRef = doc(db, "users", uid, "meta", "equipped");
  const equippedSnap = await getDoc(equippedRef);
  let current = {};
  if (equippedSnap.exists()) {
    current = equippedSnap.data();
  }

  const slotKey = item.slot || item.category || "misc";
  current[slotKey] = itemId;

  await setDoc(equippedRef, current, { merge: true });
}

async function loadEquippedSummary(uid) {
  equippedSummary.innerHTML = "";

  const equippedRef = doc(db, "users", uid, "meta", "equipped");
  const equippedSnap = await getDoc(equippedRef);
  if (!equippedSnap.exists()) {
    equippedSummary.textContent = "no equipped data yet.";
    return;
  }

  const data = equippedSnap.data();
  const entries = Object.entries(data);

  entries.forEach(([slot, itemId]) => {
    const row = document.createElement("div");
    row.className = "equipped-list-row";
    row.innerHTML = `<span>${slot}</span><span>${itemId}</span>`;
    equippedSummary.appendChild(row);
  });
}
