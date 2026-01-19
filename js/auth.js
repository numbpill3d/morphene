// js/auth.js

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  setDoc
} from "./firebase-init.js";

import { defaultProfile, STARTING_COINS } from "../config/app.js";

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const registerForm = document.getElementById("register-form");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerError = document.getElementById("register-error");

const authStatus = document.getElementById("auth-status");
const authUser = document.getElementById("auth-user");
const btnLogout = document.getElementById("btn-logout");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        loginEmail.value,
        loginPassword.value
      );
      console.log("logged in", cred.user.uid);
      window.location.href = "avatar.html";
    } catch (err) {
      console.error(err);
      loginError.textContent = err.message;
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.textContent = "";

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        registerEmail.value,
        registerPassword.value
      );

      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        email: cred.user.email,
        coins: STARTING_COINS,
        createdAt: Date.now(),
        profile: defaultProfile(cred.user.email)
      });

      console.log("registered", cred.user.uid);
      window.location.href = "avatar.html";
    } catch (err) {
      console.error(err);
      registerError.textContent = err.message;
    }
  });
}

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
    }
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!authStatus || !authUser || !btnLogout) return;

  if (user) {
    authStatus.textContent = "online";
    authUser.textContent = user.email;
    btnLogout.disabled = false;
  } else {
    authStatus.textContent = "offline";
    authUser.textContent = "none";
    btnLogout.disabled = true;
  }
});
