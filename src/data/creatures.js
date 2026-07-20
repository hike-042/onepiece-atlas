/* ============================================================
   CREATURES — named wildlife the story treats as characters in
   their own right rather than background scenery, kept separate
   from characters/index.js since these aren't people with crews,
   bounties, or dreams, just a name, a species, and a place.

   Shape: { id, name, species, locationId, status, note: one
   original sentence }
   ============================================================ */

export const CREATURES = [
  { id:"megalo", name:"Megalo", species:"Sea King", locationId:"fishmanisland", status:"alive",
    note:"Princess Shirahoshi's pet Sea King since childhood, gentle toward her despite Sea Kings' fearsome reputation elsewhere in the Grand Line." },
];

export function creaturesAtLocation(locationId){
  return CREATURES.filter(c => c.locationId === locationId);
}
