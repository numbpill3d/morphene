// config/app.js
// Application constants and defaults

export const STARTING_COINS = 1000;

export const DEFAULT_EQUIPPED = {
  baseBody: "etherian_base_1",
  eyes: "eyes_default",
  hair: "hair_001",
  top: "top_backwoods",
  bottom: "pants_black_shorts",
  accessory1: "mask_cyber_stratus"
};

export const FALLBACK_ITEMS = {
  /* --- ETHERIAN VESSELS (BASES) --- */
  "etherian_base_1": {
    displayName: "Etherian Vessel I",
    slot: "baseBody", category: "baseBody", z: 10,
    src: "assets/base/etherian/etherian-base-1.png",
    layers: [{ src: "assets/base/etherian/etherian-base-1.png", z: 10 }]
  },
  "etherian_base_2": {
    displayName: "Etherian Vessel II",
    slot: "baseBody", category: "baseBody", z: 10,
    src: "assets/base/etherian/etherian-base-2.png",
    layers: [{ src: "assets/base/etherian/etherian-base-2.png", z: 10 }]
  },
  "etherian_base_3": {
    displayName: "Etherian Vessel III",
    slot: "baseBody", category: "baseBody", z: 10,
    src: "assets/base/etherian/etherian-base-3.png",
    layers: [{ src: "assets/base/etherian/etherian-base-3.png", z: 10 }]
  },

  /* --- ENCHANTED RAIMENT (TOPS) --- */
  "top_backwoods": {
    displayName: "Backwoods Tunic",
    slot: "top", category: "top", z: 30,
    src: "assets/top/top_backwoods_shirt_etherian.png",
    layers: [{ src: "assets/top/top_backwoods_shirt_etherian.png", z: 30 }]
  },
  "top_dark_shawl": {
    displayName: "Shadow-Woven Shawl",
    slot: "top", category: "top", z: 32,
    src: "assets/top/top_darkshawl_etherian.png",
    layers: [{ src: "assets/top/top_darkshawl_etherian.png", z: 32 }]
  },
  "top_tribal_tattered": {
    displayName: "Tattered Tribal Garb",
    slot: "top", category: "top", z: 30,
    src: "assets/top/top_darktatteredtribal_etherian.png",
    layers: [{ src: "assets/top/top_darktatteredtribal_etherian.png", z: 30 }]
  },
  "top_goth_mesh": {
    displayName: "Void-Mesh Shirt",
    slot: "top", category: "top", z: 30,
    src: "assets/top/top_gothmesh_shirt_etherian.png",
    layers: [{ src: "assets/top/top_gothmesh_shirt_etherian.png", z: 30 }]
  },
  "top_vexxer_1": {
    displayName: "Vexxer Plate I",
    slot: "top", category: "top", z: 35,
    src: "assets/top/top_vexxertop_etherian.png",
    layers: [{ src: "assets/top/top_vexxertop_etherian.png", z: 35 }]
  },
  "top_witch_doctor": {
    displayName: "Witch Doctor's Mantle",
    slot: "top", category: "top", z: 35,
    src: "assets/top/top_witchdoctor_etherian.png",
    layers: [{ src: "assets/top/top_witchdoctor_etherian.png", z: 35 }]
  },

  /* --- LOWER RAIMENT (BOTTOMS) --- */
  "pants_black_shorts": {
    displayName: "Obsidian Breeches",
    slot: "bottom", category: "bottom", z: 20,
    src: "assets/bottom/pants_blackshorts_etherian.png",
    layers: [{ src: "assets/bottom/pants_blackshorts_etherian.png", z: 20 }]
  },
  "pants_dementia_skirt": {
    displayName: "Dementia Tassets",
    slot: "bottom", category: "bottom", z: 25,
    src: "assets/bottom/pants_dementiaskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_dementiaskirt_etherian.png", z: 25 }]
  },
  "pants_purple_skirt": {
    displayName: "Royal Amethyst Wrap",
    slot: "bottom", category: "bottom", z: 25,
    src: "assets/bottom/pants_purpleskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_purpleskirt_etherian.png", z: 25 }]
  },

  /* --- HEADGEAR & ARTIFACTS --- */
  "hat_black_beanie": {
    displayName: "Rogue's Night-Cap",
    slot: "head", category: "head", z: 50,
    src: "assets/head/hat_blackbeanie_etherian.png",
    layers: [{ src: "assets/head/hat_blackbeanie_etherian.png", z: 50 }]
  },
  "mask_cyber_stratus": {
    displayName: "Cyber-Stratus Veil",
    slot: "accessory1", category: "accessory1", z: 55,
    src: "assets/accessories/mask_cyberstratus_etherian.png",
    layers: [{ src: "assets/accessories/mask_cyberstratus_etherian.png", z: 55 }]
  },
  "acc_radio_glasses": {
    displayName: "Spectral Scrying Glass",
    slot: "accessory2", category: "accessory2", z: 52,
    src: "assets/accessories/face_radioglasses_etherian.png",
    layers: [{ src: "assets/accessories/face_radioglasses_etherian.png", z: 52 }]
  }
};

export const defaultProfile = (email) => ({
  displayName: email ? email.split('@')[0] : "Spirit",
  pronouns: "void/void",
  status: "scrying the void",
  tagline: "necromantic layer stacker",
  bio: "A nameless spirit wandering the threshold.",
  theme: "crt",
  accent: "cyan"
  });