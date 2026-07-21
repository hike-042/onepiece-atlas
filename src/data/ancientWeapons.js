/* ============================================================
   ANCIENT WEAPONS — Pluton, Poseidon, and Uranus, tracked as their
   own small catalog since they're facts about the world rather than
   about any one location or character, but each one is tied to
   whichever location or character currently anchors it on-page.
   See glossary.js for the general concept entry.

   Shape: { id, name, status: "undiscovered" | "identified" | "unknown",
     locationId | null, characterId | null, note: one original sentence }
   ============================================================ */

export const ANCIENT_WEAPONS = [
  { id:"pluton", name:"Pluton", status:"undiscovered", locationId:"alabasta", characterId:null,
    note:"A Void Century weapon of mass naval destruction, its blueprint's location was recorded on the Poneglyph beneath Alabasta's royal tomb, destroyed before it could fall into the wrong hands." },
  { id:"poseidon", name:"Poseidon", status:"identified", locationId:null, characterId:"shirahoshi",
    note:"Not a machine but a person, Princess Shirahoshi, born with the ability to command every Sea King in the world, confirmed to be the living ancient weapon Poseidon." },
  { id:"uranus", name:"Uranus", status:"unknown", locationId:null, characterId:null,
    note:"The one ancient weapon never even hinted at on-page, its nature and whereabouts both still a complete mystery." },
];

export function ancientWeaponAtLocation(locationId){
  return ANCIENT_WEAPONS.find(w => w.locationId === locationId) || null;
}

export function ancientWeaponForCharacter(characterId){
  return ANCIENT_WEAPONS.find(w => w.characterId === characterId) || null;
}
