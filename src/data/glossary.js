/* ============================================================
   GLOSSARY — recurring world-building terms, explained once in
   original wording so they don't need re-explaining in every
   location/character summary that references them.
   ============================================================ */

export const GLOSSARY = [
  { id:"void-century", term:"The Void Century", definition:"A hundred-year stretch of history that the World Government has erased from every record, reading about it anywhere is treated as a crime, which is exactly what makes it worth investigating." },
  { id:"poneglyph", term:"Poneglyphs", definition:"Massive stone tablets carved in a script only a handful of scholars can read, scattered across the world and holding pieces of the buried Void Century history." },
  { id:"road-poneglyph", term:"Road Poneglyphs", definition:"A specific set of four Poneglyphs that, together, mark the route to the final island, Laugh Tale." },
  { id:"will-of-d", term:"The Will of D.", definition:"A recurring middle initial shared by several pivotal figures, Luffy, Ace, Teach, Rocks, and others, whose significance is treated in-story as an ominous, unexplained pattern the World Government fears." },
  { id:"ancient-weapons", term:"The Three Ancient Weapons", definition:"Pluton, Poseidon, and Uranus, legendary weapons of mass destruction from the Void Century era, each powerful enough to reshape the balance of the world if wielded." },
  { id:"laugh-tale", term:"Laugh Tale", definition:"The final island of the Grand Line, and the resting place of the treasure One Piece. Only Gol D. Roger's crew has ever reached it." },
  { id:"one-piece-treasure", term:"One Piece", definition:"The legendary treasure left behind by the Pirate King, whose exact nature is still unknown. Its existence alone is what triggered the entire Grand Age of Pirates." },
  { id:"devil-fruit", term:"Devil Fruits", definition:"Mysterious fruits that grant a single supernatural power to whoever eats them, at the permanent cost of the ability to swim." },
  { id:"haki", term:"Haki", definition:"An inner spiritual energy every living thing possesses to some degree, trainable into three recognized forms: Observation (sensing others), Armament (hardening one's own body or striking incorporeal enemies), and the rare Conqueror's (imposing one's will directly onto others)." },
  { id:"four-emperors", term:"The Four Emperors", definition:"The title given to the four most powerful pirate captains in the New World at any given time, a rotating seat, not a fixed group, as the raid on Wano proved." },
  { id:"worst-generation", term:"The Worst Generation", definition:"A cohort of twelve pirates, all with bounties over 100 million berries, who rose to notoriety around the same time and have been colliding with each other and the World Government ever since." },
  { id:"warlords", term:"The Seven Warlords of the Sea", definition:"A now-dissolved system in which the World Government pardoned powerful pirates in exchange for acting as its enforcers when needed, a compromise both sides mostly resented." },
  { id:"buster-call", term:"Buster Call", definition:"An overwhelming Navy fleet strike authorized only by the highest levels of the World Government, intended to erase a target (island, population, and all) rather than merely defeat it." },
  { id:"celestial-dragons", term:"Celestial Dragons (World Nobles)", definition:"Descendants of the founding rulers of the World Government, who live above ordinary law and treat the rest of the world's population as beneath consideration." },
  { id:"five-elders", term:"The Five Elders", definition:"The secretive ruling council that sits above the Navy and the Celestial Dragons themselves, answering only to whatever Imu actually is." },
  { id:"grand-fleet", term:"The Straw Hat Grand Fleet", definition:"Seven independent crews, formed at Dressrosa, who pledged loyalty to Luffy without folding into his crew directly, they act on their own but answer his call." },
  { id:"log-pose", term:"Log Pose", definition:"A compass that doesn't point north. Instead it locks onto the magnetic field of whichever island is next on a Grand Line route, since normal compasses are useless there." },
  { id:"conqueror-haki", term:"Conqueror's Haki", definition:"The rarest form of Haki, letting its user overwhelm the will of weaker-willed people around them just by exerting pressure, said to appear in only one in several million people." },
  { id:"seastone", term:"Seastone", definition:"A rare mineral that drains a Devil Fruit user's strength just by touching them, acting like a solid, portable chunk of the sea itself. It's the Marines' standard tool for restraining one." },
  { id:"awakening", term:"Devil Fruit Awakening", definition:"An extremely rare stage of mastery where a user's power stops being confined to their own body and starts reshaping the world around them instead. Only a handful of the story's strongest fighters have ever reached it." },
  { id:"sea-kings", term:"Sea Kings", definition:"Enormous sea monsters native to Grand Line waters and beyond, common enough along the sea floor that Fish-Man Island's residents treat the surrounding waters as their neighborhood rather than a constant threat." },
];

export function findGlossaryTerm(id){
  return GLOSSARY.find(g => g.id === id) || null;
}
