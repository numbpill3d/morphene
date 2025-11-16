// js/market.js

import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userEmailEl = document.getElementById("user-email");
const userCoinsEl = document.getElementById("user-coins");

const listingList = document.getElementById("listing-list");
const listingEmpty = document.getElementById("listing-empty");

const listForm = document.getElementById("list-form");
const listItemIdInput = document.getElementById("list-item-id");
const listPriceInput = document.getElementById("list-price");
const listError = document.getElementById("list-error");

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
  if (userSnap.exists()) {
    userCoinsEl.textContent = userSnap.data().coins ?? 0;
  } else {
    userCoinsEl.textContent = "0";
  }

  await loadListings();
});

if (listForm) {
  listForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    listError.textContent = "";
    if (!currentUser) return;

    const itemId = listItemIdInput.value.trim();
    const price = parseInt(listPriceInput.value, 10);

    if (!itemId || !price || price < 1) {
      listError.textContent = "invalid item id or price";
      return;
    }

    const invRef = doc(db, "users", currentUser.uid, "inventory", itemId);
    const invSnap = await getDoc(invRef);
    if (!invSnap.exists()) {
      listError.textContent = "you do not own this item in inventory";
      return;
    }

    const listingsCol = collection(db, "listings");
    await addDoc(listingsCol, {
      itemId,
      seller: currentUser.uid,
      price,
      createdAt: Date.now()
    });

    alert("listed. reload page to see it in the feed.");
    listForm.reset();
    await loadListings();
  });
}

async function loadListings() {
  listingList.innerHTML = "";

  const listingsCol = collection(db, "listings");
  const listingsSnap = await getDocs(listingsCol);

  if (listingsSnap.empty) {
    listingEmpty.style.display = "block";
    return;
  } else {
    listingEmpty.style.display = "none";
  }

  for (const snap of listingsSnap.docs) {
    const data = snap.data();
    const listingId = snap.id;

    const itemRef = doc(db, "items", data.itemId);
    const itemSnap = await getDoc(itemRef);
    const item = itemSnap.exists() ? itemSnap.data() : {};

    const card = document.createElement("div");
    card.className = "listing-card";

    const info = document.createElement("div");
    info.className = "listing-info";
    info.innerHTML = `
      <div>${item.displayName || data.itemId}</div>
      <div>item id: ${data.itemId}</div>
      <div>price: ${data.price} coins</div>
      <div>seller: ${shortId(data.seller)}</div>
    `;

    const control = document.createElement("div");

    if (currentUser && data.seller === currentUser.uid) {
      const btn = document.createElement("button");
      btn.className = "btn btn-ghost";
      btn.textContent = "cancel";
      btn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "listings", listingId));
        alert("listing canceled.");
        await loadListings();
      });
      control.appendChild(btn);
    } else if (currentUser) {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "buy";
      btn.addEventListener("click", async () => {
        await buyListing(listingId, data);
        await loadListings();
      });
      control.appendChild(btn);
    }

    card.appendChild(info);
    card.appendChild(control);
    listingList.appendChild(card);
  }
}

function shortId(id) {
  return id.slice(0, 6) + "...";
}

async function buyListing(listingId, data) {
  if (!currentUser) return;

  const buyerUid = currentUser.uid;
  const sellerUid = data.seller;
  const price = data.price;
  const itemId = data.itemId;

  const buyerRef = doc(db, "users", buyerUid);
  const sellerRef = doc(db, "users", sellerUid);
  const listingRef = doc(db, "listings", listingId);

  const [buyerSnap, sellerSnap] = await Promise.all([
    getDoc(buyerRef),
    getDoc(sellerRef)
  ]);

  if (!buyerSnap.exists()) {
    alert("buyer record missing");
    return;
  }
  const buyerCoins = buyerSnap.data().coins ?? 0;
  if (buyerCoins < price) {
    alert("not enough coins");
    return;
  }

  const buyerNewCoins = buyerCoins - price;
  const sellerCoins = sellerSnap.exists() ? sellerSnap.data().coins ?? 0 : 0;
  const sellerNewCoins = sellerCoins + price;

  await Promise.all([
    updateDoc(buyerRef, { coins: buyerNewCoins }),
    updateDoc(sellerRef, { coins: sellerNewCoins })
  ]);

  const buyerInvRef = doc(db, "users", buyerUid, "inventory", itemId);
  await setDoc(buyerInvRef, { acquiredAt: Date.now() });

  const sellerInvRef = doc(db, "users", sellerUid, "inventory", itemId);
  await deleteDoc(sellerInvRef);

  await deleteDoc(listingRef);

  alert("purchase complete. your inventory should now include the item.");
}
