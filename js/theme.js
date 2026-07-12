// js/theme.js — shared theme application, imported by all pages

export function applyTheme(profile) {
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
