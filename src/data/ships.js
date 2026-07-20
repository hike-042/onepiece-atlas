/* ============================================================
   SHIPS — notable vessels, tied back to the crew that sails/sailed
   them. A ship is worth tracking separately from its crew because
   ships get replaced, destroyed, or outlive their original owners.
   ============================================================ */

export const SHIPS = [
  { id:"going-merry", name:"Going Merry", crew:"strawhats", status:"destroyed",
    note:"The Straw Hats' first ship, a small caravel gifted by Kaya. Given a proper send-off at sea rather than left to rot, see the Merry's Farewell location." },
  { id:"thousand-sunny", name:"Thousand Sunny", crew:"strawhats", status:"active",
    note:"Built by Franky at Water Seven to replace the Merry, larger, sturdier, and carries a hidden arsenal Franky keeps adding to." },
  { id:"oro-jackson", name:"Oro Jackson", crew:"rogerpirates", status:"unknown",
    note:"The Roger Pirates' ship, built by the legendary shipwright Tom. Its fate after Roger's crew disbanded isn't shown." },
  { id:"moby-dick", name:"Moby Dick", crew:"whitebeardpirates", status:"unknown",
    note:"Whitebeard's flagship, shaped like a giant whale's head. Its fate after Marineford isn't confirmed on-page." },
  { id:"red-force", name:"Red Force (Red Hair's ship)", crew:"redhairpirates", status:"active",
    note:"Shanks' flagship, the vessel that first brought the Red Hair Pirates to Foosha Village." },
  { id:"polar-tang", name:"Polar Tang", crew:"heartpirates", status:"active",
    note:"Law's submarine, allowing the Heart Pirates to travel underwater as well as on the surface." },
  { id:"victoria-punk", name:"Victoria Punk", crew:"kidpirates", status:"active",
    note:"Eustass Kid's ship, a stylized battleship reflecting his aggressive reputation." },
  { id:"ark-maxim", name:"Ark Maxim", crew:null, status:"unknown",
    note:"Enel's personal ship, built to leave Skypiea entirely for outer space after his defeat." },
  { id:"noahs-ark", name:"Noah", crew:null, status:"active",
    note:"An ancient, city-sized ark discovered at Fish-Man Island, not a crew's ship, but a Void Century relic large enough to be mistaken for one." },
];

export function shipsForCrew(crewId){
  return SHIPS.filter(s => s.crew === crewId);
}
