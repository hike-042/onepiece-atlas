/* ============================================================
   ORIGINS — a standalone catalog of where each character comes from,
   separate from the character files for the same reason devilFruits.js
   is: this is one specific fact type (birthplace/hometown) that a
   dedicated page (the Origin Tree) wants to group by geography first,
   not by crew or story arc.

   Shape:
   {
     characterId: "id in src/data/characters",
     sea: "East Blue" | "South Blue" | "West Blue" | "North Blue" | "Grand Line" | null,
     place: "Display name of the village/island/kingdom" | null,
     relation: "born" | "raised" | "stationed" | "based" | "ruled" | "sailed from" | null,
     confirmed: true | false,   // is *this specific fact* stated on-page?
     note: "optional one-line original context",
   }

   A character can have more than one entry (e.g. Sanji was born in the
   Germa Kingdom, North Blue, but raised at Baratie in East Blue) — both
   are facts, so both are recorded rather than picking just one.

   Page 6 of the source reference this was built from ("Unconfirmed
   Origins") is preserved deliberately: several major characters
   (Roger, Whitebeard, Crocodile, Mihawk, Garp, Dragon, Imu) have no
   stated birthplace in canon at all. Those get confirmed:false entries
   instead of an invented village, per this repo's rule against
   fabricating facts.
   ============================================================ */

export const ORIGINS = [
  // --- East Blue ---
  { characterId:"luffy", sea:"East Blue", place:"Foosha Village, Dawn Island", relation:"raised", confirmed:true },
  { characterId:"sabo", sea:"East Blue", place:"Goa Kingdom, Dawn Island", relation:"born", confirmed:true, note:"Born into nobility; renounced his status as a child." },
  { characterId:"zoro", sea:"East Blue", place:"Shimotsuki Village", relation:"raised", confirmed:true },
  { characterId:"koshiro", sea:"East Blue", place:"Shimotsuki Village", relation:"based", confirmed:true, note:"Zoro's dojo master." },
  { characterId:"kuina", sea:"East Blue", place:"Shimotsuki Village", relation:"raised", confirmed:true, note:"Zoro's childhood rival." },
  { characterId:"nami", sea:"East Blue", place:"Cocoyasi Village, Conomi Islands", relation:"raised", confirmed:true },
  { characterId:"nojiko", sea:"East Blue", place:"Cocoyasi Village, Conomi Islands", relation:"raised", confirmed:true, note:"Nami's adoptive sister." },
  { characterId:"bellemere", sea:"East Blue", place:"Cocoyasi Village, Conomi Islands", relation:"based", confirmed:true, note:"Nami and Nojiko's adoptive mother, killed by Arlong." },
  { characterId:"usopp", sea:"East Blue", place:"Syrup Village", relation:"raised", confirmed:true },
  { characterId:"kaya", sea:"East Blue", place:"Syrup Village", relation:"raised", confirmed:true, note:"Usopp's childhood friend." },
  { characterId:"smoker", sea:"East Blue", place:"Loguetown", relation:"stationed", confirmed:true, note:"Stationed here as a Marine captain, not a stated birthplace." },
  { characterId:"sanji", sea:"East Blue", place:"Baratie", relation:"raised", confirmed:true, note:"Raised here by Zeff after being born in the Germa Kingdom, North Blue." },
  { characterId:"zeff", sea:"East Blue", place:"Baratie", relation:"based", confirmed:true, note:"Owner-chef, Sanji's mentor." },

  // --- South Blue ---
  { characterId:"ace", sea:"South Blue", place:"Baterilla", relation:"born", confirmed:true, note:"Raised afterward in East Blue alongside Luffy." },
  { characterId:"kuma", sea:"South Blue", place:"Sorbet Kingdom", relation:"born", confirmed:true, note:"Once ruled here." },
  { characterId:"bonney", sea:"South Blue", place:"Sorbet Kingdom", relation:"born", confirmed:true, note:"Kuma's daughter." },
  { characterId:"franky", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Exact hometown not shown on-page; raised professionally at Water 7." },
  { characterId:"sengoku", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Exact hometown not shown on-page." },
  { characterId:"aokiji", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Exact hometown not shown on-page." },
  { characterId:"kid", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Exact hometown not shown on-page." },
  { characterId:"killer", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Kid's first mate; exact hometown not shown on-page." },
  { characterId:"robin-saul", sea:"South Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Saved young Robin at Ohara; reunites with her during the Elbaf arc." },

  // --- West Blue ---
  { characterId:"robin", sea:"West Blue", place:"Ohara", relation:"raised", confirmed:true, note:"Sole survivor of the island's destruction." },
  { characterId:"brook", sea:"West Blue", place:"Unspecified village", relation:"born", confirmed:true, note:"Sailed with the Rumbar Pirates; exact hometown not shown on-page." },

  // --- North Blue ---
  { characterId:"sanji", sea:"North Blue", place:"Germa Kingdom", relation:"born", confirmed:true },
  { characterId:"judge", sea:"North Blue", place:"Germa Kingdom", relation:"ruled", confirmed:true, note:"Sanji's father." },
  { characterId:"reiju", sea:"North Blue", place:"Germa Kingdom", relation:"born", confirmed:true },
  { characterId:"ichiji", sea:"North Blue", place:"Germa Kingdom", relation:"born", confirmed:true },
  { characterId:"niji", sea:"North Blue", place:"Germa Kingdom", relation:"born", confirmed:true },
  { characterId:"yonji", sea:"North Blue", place:"Germa Kingdom", relation:"born", confirmed:true },
  { characterId:"law", sea:"North Blue", place:"Flevance", relation:"born", confirmed:true, note:"Home destroyed by the Amber Lead Syndrome." },
  { characterId:"doflamingo", sea:"North Blue", place:"Mary Geoise", relation:"born", confirmed:true, note:"Born to a World Noble family." },
  { characterId:"rosinante", sea:"North Blue", place:"Mary Geoise", relation:"born", confirmed:true, note:"Doflamingo's younger brother." },
  { characterId:"noland", sea:"North Blue", place:"Lvneel", relation:"born", confirmed:true, note:"Legendary explorer, referenced in the Jaya and Skypiea arcs." },
  { characterId:"cricket", sea:"North Blue", place:"Lvneel", relation:"born", confirmed:true, note:"Noland's descendant." },
  { characterId:"shanks", sea:"North Blue", place:"God Valley", relation:"born", confirmed:true, note:"Born to the Figarland World Noble family, given away as an infant." },
  { characterId:"blackbeard", sea:"North Blue", place:"Shady Port", relation:"raised", confirmed:true, note:"Confirmed son of Rocks D. Xebec." },

  // --- Grand Line ---
  { characterId:"chopper", sea:"Grand Line", place:"Drum Island", relation:"raised", confirmed:true },
  { characterId:"kureha", sea:"Grand Line", place:"Drum Island", relation:"based", confirmed:true, note:"Chopper's mentor." },
  { characterId:"hiriluk", sea:"Grand Line", place:"Drum Island", relation:"based", confirmed:true, note:"Chopper's first mentor." },
  { characterId:"wapol", sea:"Grand Line", place:"Drum Island", relation:"ruled", confirmed:true, note:"Deposed king." },
  { characterId:"vivi", sea:"Grand Line", place:"Alabasta Kingdom", relation:"born", confirmed:true },
  { characterId:"nefertari-cobra", sea:"Grand Line", place:"Alabasta Kingdom", relation:"ruled", confirmed:true, note:"Vivi's father." },
  { characterId:"conis", sea:"Grand Line", place:"Skypiea", relation:"raised", confirmed:true },
  { characterId:"pagaya", sea:"Grand Line", place:"Skypiea", relation:"raised", confirmed:true, note:"Conis's father." },
  { characterId:"ganfall", sea:"Grand Line", place:"Skypiea", relation:"ruled", confirmed:true, note:"Former god of Skypiea, deposed by Enel." },
  { characterId:"enel", sea:"Grand Line", place:"Birka", relation:"born", confirmed:true, note:"Born here before conquering Skypiea." },
  { characterId:"franky", sea:"Grand Line", place:"Water 7", relation:"raised", confirmed:true, note:"Raised here professionally as a shipwright." },
  { characterId:"iceburg", sea:"Grand Line", place:"Water 7", relation:"based", confirmed:true, note:"Mayor of Water 7." },
  { characterId:"tom", sea:"Grand Line", place:"Water 7", relation:"based", confirmed:true, note:"Franky's mentor; built the Ancient Weapon Pluton's blueprints." },
  { characterId:"jinbe", sea:"Grand Line", place:"Fish-Man Island", relation:"born", confirmed:true },
  { characterId:"shirahoshi", sea:"Grand Line", place:"Fish-Man Island", relation:"born", confirmed:true, note:"Princess; living vessel of Poseidon." },
  { characterId:"neptune", sea:"Grand Line", place:"Fish-Man Island", relation:"ruled", confirmed:true },
  { characterId:"otohime", sea:"Grand Line", place:"Fish-Man Island", relation:"based", confirmed:true, note:"Neptune's late wife." },
  { characterId:"hody", sea:"Grand Line", place:"Fish-Man Island", relation:"born", confirmed:true },
  { characterId:"rebecca", sea:"Grand Line", place:"Dressrosa", relation:"born", confirmed:true },
  { characterId:"kyros", sea:"Grand Line", place:"Dressrosa", relation:"based", confirmed:true, note:"Rebecca's father, a former gladiator." },
  { characterId:"viola", sea:"Grand Line", place:"Dressrosa", relation:"born", confirmed:true },
  { characterId:"katakuri", sea:"Grand Line", place:"Whole Cake Island", relation:"born", confirmed:true },
  { characterId:"pudding", sea:"Grand Line", place:"Whole Cake Island", relation:"born", confirmed:true },
  { characterId:"nekomamushi", sea:"Grand Line", place:"Zou", relation:"based", confirmed:true, note:"Mink tribe guardian." },
  { characterId:"inuarashi", sea:"Grand Line", place:"Zou", relation:"based", confirmed:true, note:"Mink tribe guardian." },
  { characterId:"pekoms", sea:"Grand Line", place:"Zou", relation:"based", confirmed:true, note:"Mink tribe." },
  { characterId:"carrot", sea:"Grand Line", place:"Zou", relation:"based", confirmed:true, note:"Mink tribe." },
  { characterId:"oden", sea:"Grand Line", place:"Kuri, Wano Country", relation:"born", confirmed:true },
  { characterId:"momonosuke", sea:"Grand Line", place:"Wano Country", relation:"born", confirmed:true, note:"Oden's son." },
  { characterId:"hiyori", sea:"Grand Line", place:"Wano Country", relation:"born", confirmed:true, note:"Oden's daughter." },
  { characterId:"kinemon", sea:"Grand Line", place:"Wano Country", relation:"based", confirmed:true, note:"Oden's retainer." },
  { characterId:"yamato", sea:"Grand Line", place:"Onigashima, Wano Country", relation:"raised", confirmed:true, note:"Kaido's child." },
  { characterId:"hancock", sea:"Grand Line", place:"Amazon Lily", relation:"raised", confirmed:true },
  { characterId:"dorry", sea:"Grand Line", place:"Elbaf", relation:"born", confirmed:true, note:"First met on Little Garden during the Alabasta Saga; home confirmed as Elbaf." },
  { characterId:"brogy", sea:"Grand Line", place:"Elbaf", relation:"born", confirmed:true, note:"First met on Little Garden during the Alabasta Saga; home confirmed as Elbaf." },
  { characterId:"harald", sea:"Grand Line", place:"Elbaf", relation:"ruled", confirmed:true },
  { characterId:"loki", sea:"Grand Line", place:"Elbaf", relation:"born", confirmed:true, note:"Killed Harald for the royal family's Devil Fruit." },
  { characterId:"hajrudin", sea:"Grand Line", place:"Elbaf", relation:"born", confirmed:true },
  { characterId:"bigmom", sea:"Grand Line", place:"Elbaf", relation:"raised", confirmed:true, note:"Abandoned as an infant, raised among the giants." },
  { characterId:"vegapunk", sea:"Grand Line", place:"Egghead Island", relation:"based", confirmed:true, note:"Current base, not a stated birthplace." },

  // --- Unconfirmed origins (stated honestly, not invented) ---
  { characterId:"roger", sea:null, place:null, relation:null, confirmed:false },
  { characterId:"whitebeard", sea:null, place:null, relation:null, confirmed:false, note:"Birthplace unconfirmed; raised as an orphan on Sphinx, a poor Grand Line island." },
  { characterId:"crocodile", sea:null, place:null, relation:null, confirmed:false },
  { characterId:"mihawk", sea:null, place:null, relation:null, confirmed:false },
  { characterId:"kaido", sea:null, place:null, relation:null, confirmed:false, note:"Recent Elbaf-arc chapters have raised fan speculation about a possible tie to King Harald's bloodline, not confirmed." },
  { characterId:"imu", sea:null, place:null, relation:null, confirmed:false, note:"One of the series' central unresolved mysteries." },
  { characterId:"garp", sea:null, place:null, relation:null, confirmed:false },
  { characterId:"dragon", sea:null, place:null, relation:null, confirmed:false },
];
