// js/avatar.js

import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const avatarStage = document.getElementById("avatar-stage");
const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");
const equippedSlotsEl = document.getElementById("equipped-slots");
const layerDebugEl = document.getElementById("layer-debug");

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

  await renderAvatar(user.uid);
});

async function renderAvatar(uid) {
  avatarStage.innerHTML = "";
  equippedSlotsEl.innerHTML = "";
  layerDebugEl.textContent = "";

  const equippedRef = doc(db, "users", uid, "meta", "equipped");
  const equippedSnap = await getDoc(equippedRef);

  let equipped = {};
  if (equippedSnap.exists()) {
    equipped = equippedSnap.data();
  } else {
    // default starter shell
    equipped = {
      baseBody: "base_default",
      eyes: "eyes_default",
      hair: "hair_001",
      top: "top_001",
      bottom: "bottom_001",
      accessory1: "acc_001"
    };
  }

  const slotEntries = Object.entries(equipped);
  const allLayers = [];

  for (const [slot, itemId] of slotEntries) {
    const itemRef = doc(db, "items", itemId);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) {
      continue;
    }
    const item = itemSnap.data();

    if (Array.isArray(item.layers)) {
      item.layers.forEach(layer => {
        allLayers.push({
          src: layer.src,
          z: layer.z,
          itemId,
          slot,
          name: item.displayName || itemId
        });
      });
    } else {
      // fallback for simple items with single src
      allLayers.push({
        src: item.src,
        z: item.z ?? 50,
        itemId,
        slot,
        name: item.displayName || itemId
      });
    }

    const row = document.createElement("div");
    row.className = "equipped-list-row";
    row.innerHTML = `
      <span>${slot}</span>
      <span>${item.displayName || itemId}</span>
    `;
    equippedSlotsEl.appendChild(row);
  }

  allLayers.sort((a, b) => a.z - b.z);

  allLayers.forEach(layer => {
    const img = document.createElement("img");
    img.className = "layer";
    img.src = layer.src;
    avatarStage.appendChild(img);
  });

  const debugText = allLayers
    .map(l => `z=${l.z} slot=${l.slot} item=${l.itemId} src=${l.src}`)
    .join("\n");

  layerDebugEl.textContent = debugText;
}
