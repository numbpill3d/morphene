// js/inventory.js

import { applyTheme } from "./theme.js";
import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "./firebase-init.js";

import { defaultProfile, DEFAULT_EQUIPPED, FALLBACK_ITEMS } from "../config/app.js";

const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");
const inventoryGrid = document.getElementById("inventory-grid");
const inventoryEmpty = document.getElementById("inventory-empty");
const equippedSummary = document.getElementById("equipped-summary");
const collectionStatsEl = document.getElementById("collection-stats");
const invAvatarStage = document.getElementById("inv-avatar-stage");

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
  const userData = userSnap.exists() ? userSnap.data() : {};
  const profile = userData.profile || defaultProfile(user.email);

  if (!userData.profile) {
    await setDoc(userRef, { profile }, { merge: true });
  }

  applyTheme(profile);

  if (userSnap.exists()) {
    userCoinsEl.textContent = userData.coins ?? 0;
  } else {
    userCoinsEl.textContent = "0";
  }

  if (!filtersBound) {
    bindFilters();
  }

  equippedData = await loadEquippedSummary(user.uid);
  await loadInventory(user.uid);
  renderEquippedSummary(equippedData);
  await renderInventoryAvatar(user.uid);
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

  const items = await Promise.all(invSnap.docs.map(async (docSnap) => {
    const itemId = docSnap.id;
    const itemSnap = await getDoc(doc(db, "items", itemId));
    if (!itemSnap.exists()) {
      return { itemId, item: { displayName: "missing item data", category: "unknown", slot: "unknown", rarity: "unknown", missing: true } };
    }
    return { itemId, item: itemSnap.data() };
  }));

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
  const equippedRef = doc(db, "users", uid, "meta", "equipped");
  const equippedSnap = await getDoc(equippedRef);
  return equippedSnap.exists() ? equippedSnap.data() : {};
}

function renderEquippedSummary(equippedMap) {
  equippedSummary.innerHTML = "";
  const entries = Object.entries(equippedMap);
  if (!entries.length) {
    equippedSummary.textContent = "no equipped data yet.";
    return;
  }
  const nameMap = new Map(inventoryItems.map(({ itemId, item }) => [itemId, item.displayName || itemId]));
  entries.forEach(([slot, itemId]) => {
    const row = document.createElement("div");
    row.className = "equipped-list-row";
    row.innerHTML = `<span>${slot}</span><span>${nameMap.get(itemId) || itemId}</span>`;
    equippedSummary.appendChild(row);
  });
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
      const uid = auth.currentUser.uid;
      await equipItem(uid, item, itemId);
      equippedData = await loadEquippedSummary(uid);
      renderEquippedSummary(equippedData);
      renderInventory(equippedData);
      await renderInventoryAvatar(uid);
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

async function renderInventoryAvatar(uid) {
  if (!invAvatarStage) return;
  invAvatarStage.innerHTML = "";

  const equippedSnap = await getDoc(doc(db, "users", uid, "meta", "equipped"));
  const equipped = equippedSnap.exists() ? equippedSnap.data() : { ...DEFAULT_EQUIPPED };

  const allLayers = (await Promise.all(
    Object.entries(equipped).map(async ([, itemId]) => {
      const itemSnap = await getDoc(doc(db, "items", itemId));
      const item = itemSnap.exists() ? itemSnap.data() : (FALLBACK_ITEMS[itemId] || null);
      if (!item) return [];
      const layers = Array.isArray(item.layers) ? item.layers : [{ src: item.src, z: item.z ?? 50 }];
      return layers;
    })
  )).flat().sort((a, b) => a.z - b.z);

  allLayers.forEach(layer => {
    const img = document.createElement("img");
    img.className = "layer";
    img.src = layer.src;
    img.alt = "";
    invAvatarStage.appendChild(img);
  });
}

