// config/app.js
// Application constants and defaults

export const STARTING_COINS = 1000;

export const DEFAULT_EQUIPPED = {
  baseBody: "etherian_base_1",
  top: "top_backwoods",
  bottom: "pants_black_shorts",
  shoes: "shoes_plainboots",
  accessory1: "mask_cyber_stratus"
};

export const FALLBACK_ITEMS = {

  /* --- ETHERIAN VESSELS (LEGACY BASE SKINS) --- */
  "etherian_base_1": {
    displayName: "Etherian Vessel I",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/base/etherian/etherian-base-1.png",
    layers: [{ src: "assets/base/etherian/etherian-base-1.png", z: 10 }]
  },
  "etherian_base_2": {
    displayName: "Etherian Vessel II",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/base/etherian/etherian-base-2.png",
    layers: [{ src: "assets/base/etherian/etherian-base-2.png", z: 10 }]
  },
  "etherian_base_3": {
    displayName: "Etherian Vessel III",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/base/etherian/etherian-base-3.png",
    layers: [{ src: "assets/base/etherian/etherian-base-3.png", z: 10 }]
  },

  /* --- ETHERIAN SKIN VARIANTS (NEW) --- */
  "etherian_skin_01": {
    displayName: "Void Skin I",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian.png",
    layers: [{ src: "assets/body/etherian.png", z: 10 }]
  },
  "etherian_skin_02": {
    displayName: "Void Skin II",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_02.png",
    layers: [{ src: "assets/body/etherian_02.png", z: 10 }]
  },
  "etherian_skin_03": {
    displayName: "Void Skin III",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_03.png",
    layers: [{ src: "assets/body/etherian_03.png", z: 10 }]
  },
  "etherian_skin_04": {
    displayName: "Void Skin IV",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_04.png",
    layers: [{ src: "assets/body/etherian_04.png", z: 10 }]
  },
  "etherian_skin_05": {
    displayName: "Void Skin V",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_05.png",
    layers: [{ src: "assets/body/etherian_05.png", z: 10 }]
  },
  "etherian_skin_06": {
    displayName: "Void Skin VI",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_06.png",
    layers: [{ src: "assets/body/etherian_06.png", z: 10 }]
  },
  "etherian_skin_07": {
    displayName: "Void Skin VII",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_07.png",
    layers: [{ src: "assets/body/etherian_07.png", z: 10 }]
  },
  "etherian_skin_08": {
    displayName: "Void Skin VIII",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_08.png",
    layers: [{ src: "assets/body/etherian_08.png", z: 10 }]
  },
  "etherian_skin_09": {
    displayName: "Void Skin IX",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_09.png",
    layers: [{ src: "assets/body/etherian_09.png", z: 10 }]
  },
  "etherian_skin_10": {
    displayName: "Void Skin X",
    slot: "baseBody", category: "baseBody", rarity: "common", z: 10,
    src: "assets/body/etherian_10.png",
    layers: [{ src: "assets/body/etherian_10.png", z: 10 }]
  },

  /* --- ENCHANTED RAIMENT (TOPS) --- */
  "top_backwoods": {
    displayName: "Backwoods Tunic",
    slot: "top", category: "top", rarity: "common", z: 35,
    src: "assets/top/top_backwoods_shirt_etherian.png",
    layers: [{ src: "assets/top/top_backwoods_shirt_etherian.png", z: 35 }]
  },
  "top_dark_shawl": {
    displayName: "Shadow-Woven Shawl",
    slot: "top", category: "top", rarity: "uncommon", z: 35,
    src: "assets/top/top_darkshawl_etherian.png",
    layers: [{ src: "assets/top/top_darkshawl_etherian.png", z: 35 }]
  },
  "top_tribal_tattered": {
    displayName: "Tattered Tribal Garb",
    slot: "top", category: "top", rarity: "uncommon", z: 35,
    src: "assets/top/top_darktatteredtribal_etherian.png",
    layers: [{ src: "assets/top/top_darktatteredtribal_etherian.png", z: 35 }]
  },
  "top_goth_mesh": {
    displayName: "Void-Mesh Shirt",
    slot: "top", category: "top", rarity: "common", z: 35,
    src: "assets/top/top_gothmesh_shirt_etherian.png",
    layers: [{ src: "assets/top/top_gothmesh_shirt_etherian.png", z: 35 }]
  },
  "top_vexxer_1": {
    displayName: "Vexxer Plate I",
    slot: "top", category: "top", rarity: "rare", z: 35,
    src: "assets/top/top_vexxertop_etherian.png",
    layers: [{ src: "assets/top/top_vexxertop_etherian.png", z: 35 }]
  },
  "top_vexxer_2": {
    displayName: "Vexxer Plate II",
    slot: "top", category: "top", rarity: "rare", z: 35,
    src: "assets/top/top_vexxertop2_etherian.png",
    layers: [{ src: "assets/top/top_vexxertop2_etherian.png", z: 35 }]
  },
  "top_vexxer_3": {
    displayName: "Vexxer Plate III",
    slot: "top", category: "top", rarity: "rare", z: 35,
    src: "assets/top/top_vexxertop3_etherian.png",
    layers: [{ src: "assets/top/top_vexxertop3_etherian.png", z: 35 }]
  },
  "top_witch_doctor": {
    displayName: "Witch Doctor's Mantle",
    slot: "top", category: "top", rarity: "rare", z: 35,
    src: "assets/top/top_witchdoctor_etherian.png",
    layers: [{ src: "assets/top/top_witchdoctor_etherian.png", z: 35 }]
  },
  "top_red_tank": {
    displayName: "Crimson Void Tank",
    slot: "top", category: "top", rarity: "common", z: 35,
    src: "assets/top/top_redtanktopp_etherian.png",
    layers: [{ src: "assets/top/top_redtanktopp_etherian.png", z: 35 }]
  },
  "top_star": {
    displayName: "Astral Topp",
    slot: "top", category: "top", rarity: "uncommon", z: 35,
    src: "assets/top/top_startopp_etherian.png",
    layers: [{ src: "assets/top/top_startopp_etherian.png", z: 35 }]
  },
  "top_stripe": {
    displayName: "Spectral Stripe Topp",
    slot: "top", category: "top", rarity: "common", z: 35,
    src: "assets/top/top_stripetopp_etherian.png",
    layers: [{ src: "assets/top/top_stripetopp_etherian.png", z: 35 }]
  },
  "top_tattered_sweater": {
    displayName: "Tattered Soul Sweater",
    slot: "top", category: "top", rarity: "uncommon", z: 35,
    src: "assets/top/top_tatteredsweater_etherian.png",
    layers: [{ src: "assets/top/top_tatteredsweater_etherian.png", z: 35 }]
  },

  /* --- LOWER RAIMENT (BOTTOMS) --- */
  "pants_black_shorts": {
    displayName: "Obsidian Breeches",
    slot: "bottom", category: "bottom", rarity: "common", z: 25,
    src: "assets/bottom/pants_blackshorts_etherian.png",
    layers: [{ src: "assets/bottom/pants_blackshorts_etherian.png", z: 25 }]
  },
  "pants_dementia_skirt": {
    displayName: "Dementia Tassets",
    slot: "bottom", category: "bottom", rarity: "uncommon", z: 25,
    src: "assets/bottom/pants_dementiaskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_dementiaskirt_etherian.png", z: 25 }]
  },
  "pants_purple_skirt": {
    displayName: "Royal Amethyst Wrap",
    slot: "bottom", category: "bottom", rarity: "uncommon", z: 25,
    src: "assets/bottom/pants_purpleskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_purpleskirt_etherian.png", z: 25 }]
  },
  "pants_jean_skirt": {
    displayName: "Relic Denim Wrap",
    slot: "bottom", category: "bottom", rarity: "common", z: 25,
    src: "assets/bottom/pants_jeanskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_jeanskirt_etherian.png", z: 25 }]
  },
  "pants_real_skirt": {
    displayName: "Wraith-Cloth Skirt",
    slot: "bottom", category: "bottom", rarity: "common", z: 25,
    src: "assets/bottom/pants_realskirt_etherian.png",
    layers: [{ src: "assets/bottom/pants_realskirt_etherian.png", z: 25 }]
  },
  "pants_red_shorts": {
    displayName: "Crimson Voidshorts",
    slot: "bottom", category: "bottom", rarity: "common", z: 25,
    src: "assets/bottom/pants_redshorts_etherian.png",
    layers: [{ src: "assets/bottom/pants_redshorts_etherian.png", z: 25 }]
  },
  "pants_kawaii_brut": {
    displayName: "Kawaii Brut Breeches",
    slot: "bottom", category: "bottom", rarity: "uncommon", z: 25,
    src: "assets/bottom/pants_kawaiibrut_etherian.png",
    layers: [{ src: "assets/bottom/pants_kawaiibrut_etherian.png", z: 25 }]
  },
  "pants_pink_flowers": {
    displayName: "Bloom-Weave Wrap",
    slot: "bottom", category: "bottom", rarity: "uncommon", z: 25,
    src: "assets/bottom/pants_pinkflowers_etherian.png",
    layers: [{ src: "assets/bottom/pants_pinkflowers_etherian.png", z: 25 }]
  },

  /* --- FOOTWEAR --- */
  "shoes_plainboots": {
    displayName: "Shadow Boots",
    slot: "shoes", category: "shoes", rarity: "common", z: 27,
    src: "assets/shoes/shoes_plainboots_etherian.png",
    layers: [{ src: "assets/shoes/shoes_plainboots_etherian.png", z: 27 }]
  },
  "shoes_dustysneakers": {
    displayName: "Void Runners",
    slot: "shoes", category: "shoes", rarity: "common", z: 27,
    src: "assets/shoes/shoes_dustysneakers_etherian.png",
    layers: [{ src: "assets/shoes/shoes_dustysneakers_etherian.png", z: 27 }]
  },
  "shoes_industrialboots": {
    displayName: "Iron-Tread Stompers",
    slot: "shoes", category: "shoes", rarity: "uncommon", z: 27,
    src: "assets/shoes/shoes_industrialboots_etherian.png",
    layers: [{ src: "assets/shoes/shoes_industrialboots_etherian.png", z: 27 }]
  },
  "shoes_loafers": {
    displayName: "Spectral Slip-ons",
    slot: "shoes", category: "shoes", rarity: "common", z: 27,
    src: "assets/shoes/shoes_loafers_etherian.png",
    layers: [{ src: "assets/shoes/shoes_loafers_etherian.png", z: 27 }]
  },
  "shoes_platedboots": {
    displayName: "Siege-Plated Greaves",
    slot: "shoes", category: "shoes", rarity: "rare", z: 27,
    src: "assets/shoes/shoes_platedboots_etherian.png",
    layers: [{ src: "assets/shoes/shoes_platedboots_etherian.png", z: 27 }]
  },
  "shoes_purpwarmers": {
    displayName: "Amethyst Leg Warmers",
    slot: "shoes", category: "shoes", rarity: "uncommon", z: 27,
    src: "assets/shoes/shoes_purpwarmers_etherian.png",
    layers: [{ src: "assets/shoes/shoes_purpwarmers_etherian.png", z: 27 }]
  },
  "shoes_steeltoeboots": {
    displayName: "Steel-Kissed Greaves",
    slot: "shoes", category: "shoes", rarity: "uncommon", z: 27,
    src: "assets/shoes/shoes_steeltoeboots_etherian.png",
    layers: [{ src: "assets/shoes/shoes_steeltoeboots_etherian.png", z: 27 }]
  },
  "socks_gripsocks": {
    displayName: "Grip-Weave Hosiery",
    slot: "shoes", category: "shoes", rarity: "common", z: 27,
    src: "assets/shoes/socks_gripsocks_etherian.png",
    layers: [{ src: "assets/shoes/socks_gripsocks_etherian.png", z: 27 }]
  },
  "socks_rainbownets": {
    displayName: "Prismatic Mesh Hosiery",
    slot: "shoes", category: "shoes", rarity: "rare", z: 27,
    src: "assets/shoes/socks_rainbownets_etherian.png",
    layers: [{ src: "assets/shoes/socks_rainbownets_etherian.png", z: 27 }]
  },

  /* --- HAIR --- */
  "hair_01": {
    displayName: "Void Tresses I",
    slot: "hair", category: "hair", rarity: "common", z: 45,
    src: "assets/hair/hair_01_etherian.png",
    layers: [{ src: "assets/hair/hair_01_etherian.png", z: 45 }]
  },

  /* --- HEADGEAR --- */
  "hat_black_beanie": {
    displayName: "Rogue's Night-Cap",
    slot: "head", category: "head", rarity: "common", z: 50,
    src: "assets/head/hat_blackbeanie_etherian.png",
    layers: [{ src: "assets/head/hat_blackbeanie_etherian.png", z: 50 }]
  },
  "hat_darkgreen_beanie": {
    displayName: "Murk-Green Night-Cap",
    slot: "head", category: "head", rarity: "common", z: 50,
    src: "assets/head/hat_darkgreen_etherian.png",
    layers: [{ src: "assets/head/hat_darkgreen_etherian.png", z: 50 }]
  },
  "hat_weathered_beanie": {
    displayName: "Weathered Wanderer's Cap",
    slot: "head", category: "head", rarity: "uncommon", z: 50,
    src: "assets/head/hat_weatheredbeanie_etherian.png",
    layers: [{ src: "assets/head/hat_weatheredbeanie_etherian.png", z: 50 }]
  },

  /* --- FACE & EYES --- */
  "mask_cyber_stratus": {
    displayName: "Cyber-Stratus Veil",
    slot: "eyes", category: "eyes", rarity: "rare", z: 55,
    src: "assets/eyes/mask_cyberstratus_etherian.png",
    layers: [{ src: "assets/eyes/mask_cyberstratus_etherian.png", z: 55 }]
  },
  "acc_radio_glasses": {
    displayName: "Spectral Scrying Glass",
    slot: "eyes", category: "eyes", rarity: "uncommon", z: 55,
    src: "assets/eyes/face_radioglasses_etherian.png",
    layers: [{ src: "assets/eyes/face_radioglasses_etherian.png", z: 55 }]
  },

  /* --- ACCESSORIES --- */
  "acc_bell_choker": {
    displayName: "Bell Witch Choker",
    slot: "accessory1", category: "accessory1", rarity: "uncommon", z: 60,
    src: "assets/accessories/accessory_bellchoker_etherian.png",
    layers: [{ src: "assets/accessories/accessory_bellchoker_etherian.png", z: 60 }]
  },
  "acc_bone_talisman": {
    displayName: "Bone Ward Talisman",
    slot: "accessory1", category: "accessory1", rarity: "rare", z: 60,
    src: "assets/accessories/accessory_bonetalisman_etherian.png",
    layers: [{ src: "assets/accessories/accessory_bonetalisman_etherian.png", z: 60 }]
  },
  "acc_dark_coinpurse": {
    displayName: "Mana Purse",
    slot: "accessory2", category: "accessory2", rarity: "common", z: 62,
    src: "assets/accessories/accessory_darkcoinpurse_etherian.png",
    layers: [{ src: "assets/accessories/accessory_darkcoinpurse_etherian.png", z: 62 }]
  },
  "acc_hip_device": {
    displayName: "Arcane Hip Device",
    slot: "accessory2", category: "accessory2", rarity: "rare", z: 62,
    src: "assets/accessories/accessory_hipdevice_etherian.png",
    layers: [{ src: "assets/accessories/accessory_hipdevice_etherian.png", z: 62 }]
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
