// config/app.js
// Application constants and defaults

export const STARTING_COINS = 1000;

export const DEFAULT_EQUIPPED = {
  baseBody: "base_default",
  eyes: "eyes_default",
  hair: "hair_001",
  top: "top_001",
  bottom: "bottom_001",
  accessory1: "acc_001"
};

export const FALLBACK_ITEMS = {
  base_default: {
    displayName: "Base Shell",
    slot: "baseBody",
    category: "baseBody",
    z: 10,
    src: "assets/body/base_default.svg",
    layers: [{ src: "assets/body/base_default.svg", z: 10 }]
  },
  eyes_default: {
    displayName: "Default Eyes",
    slot: "eyes",
    category: "eyes",
    z: 30,
    src: "assets/eyes/eyes_default.svg",
    layers: [{ src: "assets/eyes/eyes_default.svg", z: 30 }]
  },
  hair_001: {
    displayName: "Black Hair",
    slot: "hair",
    category: "hair",
    z: 20,
    src: "assets/hair/hair_001.svg",
    layers: [{ src: "assets/hair/hair_001.svg", z: 20 }]
  },
  top_001: {
    displayName: "Black Tee",
    slot: "top",
    category: "top",
    z: 40,
    src: "assets/top/top_001.svg",
    layers: [{ src: "assets/top/top_001.svg", z: 40 }]
  },
  bottom_001: {
    displayName: "Blue Jeans",
    slot: "bottom",
    category: "bottom",
    z: 50,
    src: "assets/bottom/bottom_001.svg",
    layers: [{ src: "assets/bottom/bottom_001.svg", z: 50 }]
  },
  acc_001: {
    displayName: "Gold Chain",
    slot: "accessory1",
    category: "accessory1",
    z: 35,
    src: "assets/accessories/acc_001.svg",
    layers: [{ src: "assets/accessories/acc_001.svg", z: 35 }]
  },
  acc_002: {
    displayName: "Silver Ring",
    slot: "accessory2",
    category: "accessory2",
    z: 60,
    src: "assets/accessories/acc_002.svg",
    layers: [{ src: "assets/accessories/acc_002.svg", z: 60 }]
  }
};

export const defaultProfile = (email) => ({
  displayName: email || "wanderer",
  pronouns: "",
  status: "haunting the grid",
  tagline: "retro layer stacker",
  bio: "",
  theme: "crt",
  accent: "red"
});