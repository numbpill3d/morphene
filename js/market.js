// js/market.js

import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  runTransaction,
  query,
  where
} from "./firebase-init.js";

import { defaultProfile } from "../config/app.js";

const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");

const listingList = document.getElementById("listing-list");
const listingEmpty = document.getElementById("listing-empty");

const marketSortSelect = document.getElementById("market-sort");
const marketSlotSelect = document.getElementById("market-slot");

const listForm = document.getElementById("list-form");
const listItemIdInput = document.getElementById("list-item-id");
const listPriceInput = document.getElementById("list-price");
const listError = document.getElementById("list-error");

let currentUser = null;
let currentUserCoins = 0;
let listingsCache = [];
let ownedItemIds = new Set();
let filtersBound = false;

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

  if (!userData.profile) {
    await setDoc(userRef, { profile }, { merge: true });
  }

  applyTheme(profile);

  if (userSnap.exists()) {
    currentUserCoins = userData.coins ?? 0;
    userCoinsEl.textContent = currentUserCoins;
  } else {
    currentUserCoins = 0;
    userCoinsEl.textContent = "0";
  }

  if (!filtersBound) {
    bindMarketFilters();
  }

  ownedItemIds = await loadOwnedItemIds(user.uid);
  await loadListings();
});

if (listForm) {
  listForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    listError.textContent = "";
    if (!currentUser) return;

    const itemId = listItemIdInput.value.trim();
    const price = parseInt(listPriceInput.value, 10);

    if (!itemId || Number.isNaN(price) || price < 1) {
      listError.textContent = "invalid item id or price";
      return;
    }

    const invRef = doc(db, "users", currentUser.uid, "inventory", itemId);
    const invSnap = await getDoc(invRef);
    if (!invSnap.exists()) {
      listError.textContent = "you do not own this item in inventory";
      return;
    }

    const itemRef = doc(db, "items", itemId);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) {
      listError.textContent = "item id not found in items collection";
      return;
    }

    const listingsCol = collection(db, "listings");
    const dupeSnap = await getDocs(
      query(
        listingsCol,
        where("itemId", "==", itemId),
        where("seller", "==", currentUser.uid)
      )
    );
    if (!dupeSnap.empty) {
      listError.textContent = "you already have this item listed";
      return;
    }

    await addDoc(listingsCol, {
      itemId,
      seller: currentUser.uid,
      price,
      createdAt: Date.now()
    });

    alert("listed. it will appear above right away.");
    listForm.reset();
    await loadListings();
  });
}

function bindMarketFilters() {
  filtersBound = true;
  [marketSlotSelect, marketSortSelect].forEach((el) => {
    if (!el) return;
    el.addEventListener("change", renderListings);
  });
}

async function loadListings() {
  listingList.innerHTML = "";
  listingsCache = [];

  const listingsCol = collection(db, "listings");
  const listingsSnap = await getDocs(listingsCol);

  if (listingsSnap.empty) {
    listingEmpty.style.display = "block";
    listingEmpty.textContent = "No listings yet. List an item below to seed the market.";
    return;
  }

  const mapped = [];
  for (const snap of listingsSnap.docs) {
    const data = snap.data();
    const listingId = snap.id;

    const itemRef = doc(db, "items", data.itemId);
    const itemSnap = await getDoc(itemRef);
    const item = itemSnap.exists() ? itemSnap.data() : null;

    mapped.push({ id: listingId, data, item });
  }

  listingsCache = mapped;
  renderListings();
}

function renderListings() {
  listingList.innerHTML = "";

  if (!listingsCache.length) {
    listingEmpty.style.display = "block";
    listingEmpty.textContent = "No listings yet. List an item below to seed the market.";
    return;
  }

  const filtered = applyMarketFilters(listingsCache);

  if (!filtered.length) {
    listingEmpty.style.display = "block";
    listingEmpty.textContent = "No listings match your filters.";
    return;
  }

  listingEmpty.style.display = "none";

  for (const listing of filtered) {
    const { id, data, item } = listing;
    const isSeller = currentUser && data.seller === currentUser.uid;
    const owned = ownedItemIds.has(data.itemId);
    const missingItem = !item;
    const canAfford = currentUserCoins >= data.price;

    const card = document.createElement("div");
    card.className = "listing-card";
    if (owned) card.classList.add("owned");
    if (isSeller) card.classList.add("is-seller");
    if (missingItem) card.classList.add("missing");

    const info = document.createElement("div");
    info.className = "listing-info";
    info.innerHTML = `
      <div>${item?.displayName || data.itemId}</div>
      <div>item id: ${data.itemId}</div>
      <div>price: ${data.price} coins</div>
      <div>seller: ${shortId(data.seller)}</div>
    `;

    const meta = document.createElement("div");
    meta.className = "listing-meta";
    meta.textContent = `slot: ${item?.slot || item?.category || "unknown"} / rarity: ${item?.rarity || "unknown"} / listed: ${formatAge(data.createdAt)}`;
    info.appendChild(meta);

    const control = document.createElement("div");

    if (isSeller) {
      const btn = document.createElement("button");
      btn.className = "btn btn-ghost";
      btn.textContent = "cancel";
      btn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "listings", id));
        alert("listing canceled.");
        await loadListings();
      });
      control.appendChild(btn);
    } else if (currentUser) {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = canAfford ? "buy" : "not enough coins";
      btn.disabled = !canAfford || missingItem;
      btn.addEventListener("click", async () => {
        await buyListing(listing);
      });
      control.appendChild(btn);
    }

    card.appendChild(info);
    card.appendChild(control);
    listingList.appendChild(card);
  }
}

function applyMarketFilters(listings) {
  const slotVal = marketSlotSelect ? marketSlotSelect.value : "all";
  const sortVal = marketSortSelect ? marketSortSelect.value : "recent";

  let filtered = listings.filter(({ item, data }) => {
    const slot = item?.slot || item?.category || "unknown";
    const matchesSlot = slotVal === "all" || slot === slotVal;
    return matchesSlot && data;
  });

  filtered = filtered.sort((a, b) => {
    const priceA = a.data.price || 0;
    const priceB = b.data.price || 0;
    const timeA = a.data.createdAt || 0;
    const timeB = b.data.createdAt || 0;

    if (sortVal === "price-asc") return priceA - priceB;
    if (sortVal === "price-desc") return priceB - priceA;
    return timeB - timeA; // recent first
  });

  return filtered;
}

function shortId(id) {
  return id.slice(0, 6) + "...";
}

async function buyListing(listing) {
  if (!currentUser) return;

  const listingRef = doc(db, "listings", listing.id);
  const buyerRef = doc(db, "users", currentUser.uid);
  const sellerRef = doc(db, "users", listing.data.seller);
  const buyerInvRef = doc(db, "users", currentUser.uid, "inventory", listing.data.itemId);
  const sellerInvRef = doc(db, "users", listing.data.seller, "inventory", listing.data.itemId);

  try {
    await runTransaction(db, async (tx) => {
      const listingSnap = await tx.get(listingRef);
      if (!listingSnap.exists()) {
        throw new Error("listing no longer exists");
      }

      const data = listingSnap.data();
      if (data.seller === currentUser.uid) {
        throw new Error("you cannot buy your own listing");
      }

      const buyerSnap = await tx.get(buyerRef);
      if (!buyerSnap.exists()) throw new Error("buyer record missing");
      const buyerCoins = buyerSnap.data().coins ?? 0;
      if (buyerCoins < data.price) throw new Error("not enough coins");

      const sellerSnap = await tx.get(sellerRef);
      const sellerCoins = sellerSnap.exists() ? sellerSnap.data().coins ?? 0 : 0;

      tx.set(buyerRef, { coins: buyerCoins - data.price }, { merge: true });
      tx.set(sellerRef, { coins: sellerCoins + data.price }, { merge: true });
      tx.set(buyerInvRef, { acquiredAt: Date.now() });
      tx.delete(sellerInvRef);
      tx.delete(listingRef);
    });

    alert("purchase complete. your inventory should now include the item.");
    await refreshUserCoins(currentUser.uid);
    ownedItemIds = await loadOwnedItemIds(currentUser.uid);
    await loadListings();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function refreshUserCoins(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    currentUserCoins = userSnap.data().coins ?? 0;
    userCoinsEl.textContent = currentUserCoins;
  } else {
    currentUserCoins = 0;
    userCoinsEl.textContent = "0";
  }
}

async function loadOwnedItemIds(uid) {
  const invSnap = await getDocs(collection(db, "users", uid, "inventory"));
  return new Set(invSnap.docs.map((docSnap) => docSnap.id));
}

function formatAge(timestamp) {
  if (!timestamp) return "unknown";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
