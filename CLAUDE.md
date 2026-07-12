# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Morphene / Void Avatar Lounge** — a retro Y2K gothic dress-up game. Static web app (no build step) with vanilla JS ES6 modules + Firebase backend. Users register, customize layered PNG/SVG avatars, manage inventory, and trade items on a player-to-player marketplace.

## Running locally

No build step. Serve the root directory with any HTTP server:

```bash
python -m http.server 8000
# or
npx serve .
```

Firebase Hosting deployment (deploys from root, not `public/`):
```bash
firebase deploy --only hosting
# to also deploy firestore rules and indexes:
firebase deploy
```

To seed sample item data, paste the contents of `js/setup-data.js` into the browser console while logged in.

## Architecture

### Pages + modules

Each HTML page (`avatar.html`, `inventory.html`, `market.html`, `profile.html`) is self-contained and imports its own JS module from `js/`. The entry page `index.html` handles auth (login/register). There is no router.

| Page | Module | Responsibility |
|------|--------|---------------|
| `index.html` | `js/auth.js` | Login, register, session |
| `avatar.html` | `js/avatar.js` | Layer rendering, avatar display |
| `inventory.html` | `js/inventory.js` | Item collection, equipping |
| `market.html` | `js/market.js` | Listings, buy/sell transactions |
| `profile.html` | `js/profile.js` | Display name, pronouns, bio, theme |

All modules import Firebase services from `js/firebase-init.js`. Config constants (starting coins, defaults) live in `config/app.js`. Firebase SDK URLs are pinned to v10.12.0 in `config/firebase.js`.

### Auth guard pattern

Every protected page opens with:
```js
onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = "index.html"; return; }
  // load page...
});
```

### Avatar layer system

Items in Firestore have either a single `src`+`z` or a `layers[]` array with per-layer z-indices. `avatar.js` flattens all equipped items' layers, sorts by `z` ascending, then renders stacked `<img>` elements. Z-values must be set explicitly per item — no auto-assignment. Conflicting Z values produce undefined stacking order.

**Asset spec:** draw at **100×160px**, displayed at **200×320px** (2× CSS scale). Every layer PNG must be exactly 100×160 on the canvas — transparency outside the character is what makes stacking work. `image-rendering: pixelated` is already applied via CSS.

### Firestore structure

```
/users/{uid}            — email, coins, createdAt, profile{}
  /inventory/{itemId}   — acquiredAt (keyed by itemId, so max one per user)
  /meta/equipped        — {slot: itemId, ...}

/items/{itemId}         — displayName, category, slot, rarity, z, src, layers[]
/listings/{listingId}   — itemId, seller (uid), price, createdAt
```

Public read on `items` and `listings`. Users can only write their own data (see `firestore.rules`).

### Marketplace transactions

Purchases use `runTransaction()` for atomicity: deducts buyer coins, credits seller, transfers item subcollection, deletes listing. Guards against: buying own item, relisting the same item twice, insufficient funds. This is the most complex code in the project — `js/market.js`.

### Theming

`css/style.css` uses `--ink-*` / `--bg-*` CSS custom properties throughout. Body classes `theme-void`, `theme-ash`, etc. + `accent-red`, `accent-cyan`, `accent-violet`, `accent-lime` drive the full color scheme. `applyTheme(profile)` lives in `js/theme.js` and is imported by all page modules.

## Non-obvious constraints

- **Firebase config** in `js/firebase-init.js` has placeholder values — must be real credentials for the app to work.
- **No environment variables** — config is hardcoded; there's no `.env` system.
- **Asset paths are relative** — all image `src` values assume flat deployment from the repo root.
- **Inventory uniqueness** is enforced by Firestore doc key (itemId), not application logic. A user can only hold one of each item.
- **Firebase SDK version** is hardcoded in `config/firebase.js`. Bumping requires updating all URLs there.
