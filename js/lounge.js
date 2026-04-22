// js/lounge.js

import { applyTheme } from "./theme.js";
import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  limit
} from "./firebase-init.js";

import { defaultProfile, FALLBACK_ITEMS } from "../config/app.js";

const userEmailEl = document.getElementById("user-email");
const userManaEl = document.getElementById("user-coins");
const soulGrid = document.getElementById("soul-grid");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  userEmailEl.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};
  const profile = userData.profile || defaultProfile(user.email);

  applyTheme(profile);

  if (userSnap.exists()) {
    userManaEl.textContent = userData.coins ?? 0;
  }

  await loadSouls();
});

async function loadSouls() {
  if (!soulGrid) return;
  soulGrid.innerHTML = "";

  const usersCol = collection(db, "users");
  const q = query(usersCol, limit(20)); // Just the first 20 souls
  const usersSnap = await getDocs(q);

  if (usersSnap.empty) {
    soulGrid.innerHTML = `<div class="hint-text">The grid is cold and empty.</div>`;
    return;
  }

  for (const userDoc of usersSnap.docs) {
    const userData = userDoc.data();
    const profile = userData.profile || defaultProfile(userDoc.id);
    const equipped = userData.equipped || {};

    const card = document.createElement("div");
    card.className = "window sub-window";
    card.style.padding = "8px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.gap = "8px";

    // Small Avatar Render
    const stage = document.createElement("div");
    stage.className = "avatar-stage";
    stage.style.width = "100px";
    stage.style.height = "160px";
    stage.style.border = "1px solid var(--line-iron)";
    
    // Draw layers
    const layers = Object.values(equipped)
      .map(itemId => FALLBACK_ITEMS[itemId])
      .filter(Boolean)
      .sort((a, b) => a.z - b.z);

    layers.forEach(item => {
      item.layers.forEach(l => {
        const img = document.createElement("img");
        img.src = l.src;
        img.className = "layer";
        img.style.zIndex = l.z;
        img.style.width = "100px";
        img.style.height = "160px";
        stage.appendChild(img);
      });
    });

    const info = document.createElement("div");
    info.style.textAlign = "center";
    info.innerHTML = `
      <div class="profile-name" style="font-size: 13px;">${profile.displayName}</div>
      <div class="hint-text" style="font-size: 9px; color: var(--ink-ghost);">${profile.status}</div>
    `;

    card.appendChild(stage);
    card.appendChild(info);
    soulGrid.appendChild(card);
  }
}
