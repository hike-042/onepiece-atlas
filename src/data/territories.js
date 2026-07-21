/* ============================================================
   EMPEROR TERRITORIES — the handful of locations that are (or were)
   unambiguously shown on-page as one Emperor's home turf, not a
   full political map of the New World, since the story never draws
   one. Only add an entry here when a location's own summary/outcome
   already establishes the tie (see locations.js), matching this
   catalog's sibling files (poneglyphs.js, ancientWeapons.js) in
   staying strictly to established facts.

   Shape: { id, locationId, emperorId, crewId, status: "current" |
     "former", color: a hex used for the territory's map ring,
     note: one original sentence }
   ============================================================ */

export const TERRITORIES = [
  { id:"wholecake-territory", locationId:"wholecake", emperorId:"bigmom", crewId:"bigmompirates", status:"current", color:"#C94F7C",
    note:"Big Mom's home territory, Totto Land, an entire nation built and held together by soul-based homie contracts." },
  { id:"wano-territory", locationId:"wano", emperorId:"kaido", crewId:"beastspirates", status:"former", color:"#4a5a7a",
    note:"Kaido ruled Wano for two decades as its shadow shogun before Luffy's raid ended his reign and stripped him of Emperor status." },
];

export function territoryAtLocation(locationId){
  return TERRITORIES.find(t => t.locationId === locationId) || null;
}
