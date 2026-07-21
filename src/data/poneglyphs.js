/* ============================================================
   PONEGLYPHS — the specific stone tablets seen on-page, kept as
   their own catalog (like devilFruits.js) since a tablet's story is
   about where it sits and what it records, not about any one
   character. See glossary.js for the general concept entries
   ("Poneglyphs", "Road Poneglyphs") this file tracks individual
   tablets, tied back to the location that holds them.

   Shape:
   { id, name, locationId, kind: "history" | "road" | "master",
     color: "black" | "red", status, read: has its text actually been
     read/transcribed by a named character on-page, summary: one
     original sentence }
   ============================================================ */

export const PONEGLYPHS = [
  { id:"shandora", name:"Shandora Poneglyph", locationId:"skypiea", kind:"history", color:"black", status:"intact", read:true,
    summary:"The first Poneglyph seen on-page, carved into the ruins of a golden city that fell from the sky centuries ago, its translation is what first proves the tablets even exist." },
  { id:"alabasta-tomb", name:"Alubarna Royal Tomb Poneglyph", locationId:"alabasta", kind:"history", color:"black", status:"destroyed", read:true,
    summary:"Hidden beneath Alabasta's royal tomb and recording the ancient weapon Pluton's construction site, burned to rubble in the fighting that ended Crocodile's coup." },
  { id:"zou-back", name:"Zunesha's Back Poneglyph", locationId:"zou", kind:"road", color:"black", status:"intact", read:true,
    summary:"Carved directly into the living elephant Zunesha's back, one of the four Road Poneglyphs whose combined text points the way to Laugh Tale." },
  { id:"whole-cake", name:"Whole Cake Island Poneglyph", locationId:"wholecake", kind:"road", color:"black", status:"intact", read:false,
    summary:"One of the four Road Poneglyphs, its location and text already memorized by Charlotte Pudding, who was born with the rare ability to read the script by sight, though the tablet itself hasn't been read directly on-page yet." },
  { id:"wano-onigashima", name:"Onigashima Poneglyph", locationId:"wano", kind:"road", color:"black", status:"intact", read:true,
    summary:"A Road Poneglyph on Onigashima, originally part of Wano before that outer rim split away, read and transcribed in full by Kozuki Oden decades before the story begins." },
  { id:"rio-poneglyph", name:"Rio Poneglyph", locationId:"fishmanisland", kind:"master", color:"red", status:"intact", read:false,
    summary:"Hidden in Fish-Man Island's Sea Forest and carved in a distinct reddish stone, the master tablet that records the true history in full and reveals Laugh Tale's location once read alongside the Road Poneglyphs, still unread as of the story's current point." },
];

export function poneglyphsAtLocation(locationId){
  return PONEGLYPHS.filter(p => p.locationId === locationId);
}

export function roadPoneglyphProgress(){
  const road = PONEGLYPHS.filter(p => p.kind === 'road');
  const rio = PONEGLYPHS.find(p => p.kind === 'master') || null;
  return { total: road.length, read: road.filter(p => p.read).length, rio };
}
