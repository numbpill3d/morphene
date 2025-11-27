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
const collectionStatsEl = document.getElementById("collection-stats");

const filterSlot = document.getElementById("filter-slot");
const filterRarity = document.getElementById("filter-rarity");
const filterSearch = document.getElementById("filter-search");
const filterClear = document.getElementById("filter-clear");

let inventoryItems = [];
let equippedData = {};
let hasInventory = false;
let filtersBound = false;

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

  if (!filtersBound) {
    bindFilters();
  }

  equippedData = await loadEquippedSummary(user.uid);
  await loadInventory(user.uid);
});

function bindFilters() {
  filtersBound = true;
  const rerender = () => renderInventory(equippedData);

  [filterSlot, filterRarity, filterSearch].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", rerender);
  });

  if (filterClear) {
    filterClear.addEventListener("click", () => {
      if (filterSlot) filterSlot.value = "all";
      if (filterRarity) filterRarity.value = "all";
      if (filterSearch) filterSearch.value = "";
      renderInventory(equippedData);
    });
  }
}

async function loadInventory(uid) {
  inventoryGrid.innerHTML = "";
  hasInventory = false;

  const invCol = collection(db, "users", uid, "inventory");
  const invSnap = await getDocs(invCol);

  if (invSnap.empty) {
    inventoryEmpty.style.display = "block";
    inventoryEmpty.textContent = "No items yet. Visit the Market to buy your first layers.";
    updateCollectionStats([], equippedData);
    return;
  } else {
    inventoryEmpty.style.display = "none";
  }

  const items = [];
  for (const docSnap of invSnap.docs) {
    const itemId = docSnap.id;
    const itemRef = doc(db, "items", itemId);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) {
      items.push({
        itemId,
        item: {
          displayName: "missing item data",
          category: "unknown",
          slot: "unknown",
          rarity: "unknown",
          missing: true
        }
      });
      continue;
    }
    items.push({ itemId, item: itemSnap.data() });
  }

  hasInventory = items.length > 0;
  inventoryItems = items;
  renderInventory(equippedData);
  updateCollectionStats(items, equippedData);
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
    return {};
  }

  const data = equippedSnap.data();
  const entries = Object.entries(data);

  entries.forEach(([slot, itemId]) => {
    const row = document.createElement("div");
    row.className = "equipped-list-row";
    row.innerHTML = `<span>${slot}</span><span>${itemId}</span>`;
    equippedSummary.appendChild(row);
  });

  return data;
}

function renderInventory(equippedMap = {}) {
  if (!inventoryGrid) return;
  inventoryGrid.innerHTML = "";

  const filtered = applyFilters(inventoryItems);

  if (!hasInventory) {
    inventoryEmpty.style.display = "block";
    inventoryEmpty.textContent = "No items yet. Visit the Market to buy your first layers.";
    return;
  }

  if (filtered.length === 0) {
    inventoryEmpty.style.display = "block";
    inventoryEmpty.textContent = "No items match your filters.";
    return;
  }

  inventoryEmpty.style.display = "none";

  for (const { itemId, item } of filtered) {
    const card = document.createElement("div");
    card.className = "inventory-card";

    const header = document.createElement("div");
    header.className = "inventory-card-header";
    const nameSpan = document.createElement("span");
    nameSpan.className = "inventory-card-name";
    nameSpan.textContent = item.displayName || itemId;
    const catSpan = document.createElement("span");
    catSpan.className = "inventory-card-cat";
    catSpan.textContent = item.category || item.slot || "misc";
    header.appendChild(nameSpan);
    header.appendChild(catSpan);

    const pillRow = document.createElement("div");
    pillRow.className = "inventory-pill-row";
    const rarity = document.createElement("span");
    rarity.className = "rarity-pill";
    rarity.textContent = item.rarity || "unknown";
    const slotSpan = document.createElement("span");
    slotSpan.textContent = `slot: ${item.slot || item.category || "n/a"}`;
    pillRow.appendChild(rarity);
    pillRow.appendChild(slotSpan);

    const meta = document.createElement("div");
    meta.textContent = item.missing
      ? "item data missing from items collection."
      : (item.description || "ready to equip.");

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "equip";
    btn.disabled = !!item.missing;
    btn.addEventListener("click", async () => {
      await equipItem(auth.currentUser.uid, item, itemId);
      equippedData = await loadEquippedSummary(auth.currentUser.uid);
      renderInventory(equippedData);
      alert(`equipped ${item.displayName || itemId}`);
    });

    if (equippedMap[item.slot || item.category] === itemId) {
      card.classList.add("equipped");
    }

    card.appendChild(header);
    card.appendChild(pillRow);
    card.appendChild(meta);
    card.appendChild(btn);
    inventoryGrid.appendChild(card);
  }
}

function applyFilters(items) {
  const slotVal = filterSlot ? filterSlot.value : "all";
  const rarityVal = filterRarity ? filterRarity.value : "all";
  const searchVal = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

  return items.filter(({ itemId, item }) => {
    const slot = item.slot || item.category || "misc";
    const rarity = item.rarity || "unknown";
    const name = (item.displayName || "").toLowerCase();

    const matchesSlot = slotVal === "all" || slot === slotVal;
    const matchesRarity = rarityVal === "all" || rarity === rarityVal;
    const matchesSearch =
      !searchVal ||
      name.includes(searchVal) ||
      itemId.toLowerCase().includes(searchVal);

    return matchesSlot && matchesRarity && matchesSearch;
  });
}

function updateCollectionStats(items, equippedMap = {}) {
  if (!collectionStatsEl) return;

  if (!items.length) {
    collectionStatsEl.textContent = "No inventory data to analyze yet.";
    return;
  }

  const rarityCounts = {};
  const slotCounts = {};

  items.forEach(({ item }) => {
    const rarity = item.rarity || "unknown";
    const slot = item.slot || item.category || "misc";
    rarityCounts[rarity] = (rarityCounts[rarity] || 0) + 1;
    slotCounts[slot] = (slotCounts[slot] || 0) + 1;
  });

  const rarityLine = Object.entries(rarityCounts)
    .map(([key, val]) => `${key}:${val}`)
    .join(" / ");

  const slotLine = Object.entries(slotCounts)
    .map(([key, val]) => `${key}:${val}`)
    .join(" / ");

  const equippedLine = Object.keys(equippedMap || {}).length;

  collectionStatsEl.textContent =
    `items: ${items.length}\n` +
    `rarity mix: ${rarityLine}\n` +
    `slot coverage: ${slotLine}\n` +
    `equipped slots filled: ${equippedLine}`;
}
