// js/profile.js

import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc
} from "./firebase-init.js";

import { defaultProfile } from "../config/app.js";

const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");

const profileCard = document.getElementById("profile-card");
const profileName = document.getElementById("profile-name");
const profilePronouns = document.getElementById("profile-pronouns");
const profileStatus = document.getElementById("profile-status");
const profileTagline = document.getElementById("profile-tagline");
const profileBio = document.getElementById("profile-bio");

const form = document.getElementById("profile-form");
const displayNameInput = document.getElementById("display-name");
const pronounsInput = document.getElementById("pronouns");
const statusInput = document.getElementById("status");
const taglineInput = document.getElementById("tagline");
const bioInput = document.getElementById("bio");
const themeInput = document.getElementById("theme");
const accentInput = document.getElementById("accent");
const profileError = document.getElementById("profile-error");
const profileSuccess = document.getElementById("profile-success");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userEmailEl.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};

  const coins = userData.coins ?? 0;
  userCoinsEl.textContent = coins;

  const profile = userData.profile || defaultProfile(user.email);
  // Ensure profile saved at least once
  await setDoc(userRef, { profile }, { merge: true });

  populateProfile(profile);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await saveProfile(user.uid);
    });
  }
});

function populateProfile(profile) {
  if (!profile) return;
  displayNameInput.value = profile.displayName || "";
  pronounsInput.value = profile.pronouns || "";
  statusInput.value = profile.status || "";
  taglineInput.value = profile.tagline || "";
  bioInput.value = profile.bio || "";
  themeInput.value = profile.theme || "crt";
  accentInput.value = profile.accent || "red";

  renderProfileCard(profile);
  applyTheme(profile);
}

async function saveProfile(uid) {
  profileError.textContent = "";
  profileSuccess.textContent = "";

  const profile = {
    displayName: displayNameInput.value.trim() || "unnamed",
    pronouns: pronounsInput.value.trim(),
    status: statusInput.value.trim() || "haunting the grid",
    tagline: taglineInput.value.trim(),
    bio: bioInput.value.trim(),
    theme: themeInput.value,
    accent: accentInput.value
  };

  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { profile }, { merge: true });
    renderProfileCard(profile);
    applyTheme(profile);
    profileSuccess.textContent = "profile saved.";
  } catch (err) {
    console.error(err);
    profileError.textContent = err.message;
  }
}

function renderProfileCard(profile) {
  profileName.textContent = profile.displayName || "unnamed";
  profilePronouns.textContent = profile.pronouns || "";
  profileStatus.textContent = profile.status || "";
  profileTagline.textContent = profile.tagline || "";
  profileBio.textContent = profile.bio || "";
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
