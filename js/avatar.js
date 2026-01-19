// js/avatar.js

import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc
} from "./firebase-init.js";

import { DEFAULT_EQUIPPED, FALLBACK_ITEMS, defaultProfile } from "../config/app.js";

const avatarStage = document.getElementById("avatar-stage");
const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");
const equippedSlotsEl = document.getElementById("equipped-slots");
const layerDebugEl = document.getElementById("layer-debug");
const avatarStatusEl = document.getElementById("avatar-status");
const refreshBtn = document.getElementById("btn-refresh-avatar");
const profileNameEl = document.getElementById("avatar-profile-name");
const profilePronounsEl = document.getElementById("avatar-profile-pronouns");
const profileStatusEl = document.getElementById("avatar-profile-status");
const profileTaglineEl = document.getElementById("avatar-profile-tagline");

let currentUid = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUid = user.uid;
  userEmailEl.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};
  const profile = userData.profile || defaultProfile(user.email);

  if (!userData.profile) {
    await setDoc(userRef, { profile }, { merge: true });
  }

  applyTheme(profile);
  renderProfile(profile);

  if (userSnap.exists()) {
    userCoinsEl.textContent = userData.coins ?? 0;
  } else {
    userCoinsEl.textContent = "0";
  }

  await renderAvatar(user.uid);
});

if (refreshBtn) {
  refreshBtn.addEventListener("click", async () => {
    if (!currentUid) return;
    await renderAvatar(currentUid);
  });
}

async function renderAvatar(uid) {
  avatarStage.innerHTML = "";
  equippedSlotsEl.innerHTML = "";
  layerDebugEl.textContent = "";

  setAvatarStatus("loading layers...");

  try {
    const equippedRef = doc(db, "users", uid, "meta", "equipped");
    const equippedSnap = await getDoc(equippedRef);

    let equipped = {};
    if (equippedSnap.exists()) {
      equipped = equippedSnap.data();
    } else {
      // default starter shell
      equipped = { ...DEFAULT_EQUIPPED };
    }

    const slotEntries = Object.entries(equipped);
    const allLayers = [];
    const missing = [];

    for (const [slot, itemId] of slotEntries) {
      const item = await fetchItem(itemId);
      if (!item) {
        missing.push(`${slot}:${itemId}`);
        continue;
      }

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

    allLayers.forEach((layer, index) => {
      const img = document.createElement("img");
      img.className = "layer";
      img.src = layer.src;
      img.alt = `${layer.name || layer.itemId} (${layer.slot}) #${index}`;
      avatarStage.appendChild(img);
    });

    const debugText = allLayers
      .map(l => `z=${l.z} slot=${l.slot} item=${l.itemId} src=${l.src}`)
      .join("\n");

    layerDebugEl.textContent = debugText;

    if (missing.length) {
      setAvatarStatus(`rendered ${allLayers.length} layers. missing: ${missing.join(", ")}`);
    } else {
      setAvatarStatus(`rendered ${allLayers.length} layers @ ${new Date().toLocaleTimeString()}`);
    }
  } catch (err) {
    console.error(err);
    setAvatarStatus(`render failed: ${err.message}`);
  }
}

async function fetchItem(itemId) {
  const itemRef = doc(db, "items", itemId);
  const itemSnap = await getDoc(itemRef);
  if (itemSnap.exists()) return itemSnap.data();
  if (FALLBACK_ITEMS[itemId]) return FALLBACK_ITEMS[itemId];
  return null;
}

function setAvatarStatus(msg) {
  if (avatarStatusEl) {
    avatarStatusEl.textContent = msg;
  }
}

function renderProfile(profile) {
  if (profileNameEl) profileNameEl.textContent = profile.displayName || "";
  if (profilePronounsEl) profilePronounsEl.textContent = profile.pronouns || "";
  if (profileStatusEl) profileStatusEl.textContent = profile.status || "";
  if (profileTaglineEl) profileTaglineEl.textContent = profile.tagline || "";
}

function applyTheme(profile) {
  const body = document.body;
  if (!body) return;

  if (profile.theme === "crt") {
    body.classList.add("crt");
  } else {
    body.classList.remove("crt");
  }

  body.classList.remove("accent-red", "accent-cyan", "accent-violet", "accent-lime");
  body.classList.add(`accent-${profile.accent || "red"}`);
}
