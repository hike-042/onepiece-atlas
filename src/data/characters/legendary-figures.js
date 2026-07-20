/* ============================================================
   LEGENDARY & MYTHIC FIGURES
   Characters whose significance is mostly historical or mythic rather
   than crew-based — they don't fit neatly into any existing themed
   shard, but their relationships matter enough to the graph to need
   full curated treatment (summary + related), not bare-stub tier.
   ============================================================ */

export const LEGENDARY_FIGURES = [
  { id:"oden", name:"Kozuki Oden", epithet:null, affiliation:"Kozuki Family",
    role:"Former Daimyo of Kuri", status:"deceased", firstSeenAt:"wano",
    devilFruit:null, weapon:"Two-sword style, Enma among his blades", haki:["Armament","Conqueror's"],
    summary:"A Wano daimyo who sailed with Roger's crew for one voyage before returning home to defy Orochi and Kaido's takeover, and was executed for it.",
    related:[
      {id:"roger", type:"sailed with his crew for one full voyage"},
      {id:"toki", type:"wife"},
      {id:"momonosuke", type:"son"},
      {id:"hiyori", type:"daughter"},
      {id:"kinemon", type:"retainer, carried out his dying wish two decades later"},
      {id:"orochi", type:"executed by the regime Orochi and Kaido installed"},
      {id:"kaido", type:"defied his takeover of Wano"},
    ] },
  { id:"enel", name:"Enel", epithet:null, affiliation:"Former ruler of Skypiea",
    role:"Self-declared god of Skypiea", status:"alive", firstSeenAt:"skypiea",
    devilFruit:{ name:"Goro Goro no Mi", type:"Logia", effect:"Lets him become, generate, and control lightning, striking and moving at electric speed." },
    weapon:"Lightning-based combat", haki:["Observation"],
    summary:"A lightning-fruit user who ruled Skypiea as a false god until Luffy's rubber body proved immune to his one real weapon.",
    related:[
      {id:"ganfall", type:"deposed him as Skypiea's former ruler"},
      {id:"luffy", type:"defeated him, ending his rule over Skypiea"},
    ] },
  { id:"kuma", name:"Bartholomew Kuma", epithet:"Tyrant", affiliation:"Former Warlord",
    role:"Former Warlord, secret revolutionary", status:"alive", firstSeenAt:"thrillerbark",
    devilFruit:{ name:"Nikyu Nikyu no Mi", type:"Paramecia", effect:"Lets him repel anything he touches, including pain, fatigue, and people themselves, with a paw-shaped push." },
    weapon:"Paw-based repel combat", haki:["Armament"],
    summary:"A former Warlord and secret revolutionary, enslaved and lobotomized by the Celestial Dragons after quietly saving the Straw Hats twice.",
    related:[
      {id:"bonney", type:"daughter"},
      {id:"hancock", type:"fellow former slave of the Celestial Dragons"},
      {id:"dragon", type:"former ally in the Revolutionary Army"},
      {id:"luffy", type:"scattered the crew safely across the world at Sabaody rather than handing them to the Navy"},
    ] },
  { id:"moria", name:"Gecko Moria", epithet:null, affiliation:"Former Warlord",
    role:"Former Warlord", status:"alive", firstSeenAt:"thrillerbark",
    devilFruit:{ name:"Kage Kage no Mi", type:"Paramecia", effect:"Lets him steal and stitch shadows onto other bodies or corpses, animating them with the stolen shadow's power." },
    weapon:"Shadow-stitched zombie army", haki:["Armament"],
    summary:"A former Warlord who built an undead army out of stolen shadows at Thriller Bark, including the one he took from Brook decades earlier.",
    related:[
      {id:"brook", type:"stole his shadow decades before the Straw Hats freed it"},
      {id:"luffy", type:"defeated him at Thriller Bark"},
    ] },
  { id:"joyboy", name:"Joy Boy", epithet:null, affiliation:"Unknown (Void Century)",
    role:"Legendary Void Century figure", status:"unknown", firstSeenAt:"fishmanisland",
    devilFruit:null, weapon:null, haki:[],
    summary:"A legendary figure from the Void Century, eight hundred years past, whose unfulfilled promises and Devil Fruit legacy still shape the present story.",
    related:[
      {id:"luffy", type:"shares his Devil Fruit legacy, the Hito Hito no Mi, Model: Nika"},
      {id:"zunesha", type:"left Zunesha an unfulfilled promise it still carries"},
      {id:"imu", type:"knew each other during the Void Century"},
      {id:"shirahoshi", type:"left the merfolk of Fish-Man Island an unfulfilled promise"},
    ] },
  { id:"zunesha", name:"Zunesha", epithet:null, affiliation:"Unknown",
    role:"Colossal ancient elephant carrying the island of Zou", status:"alive", firstSeenAt:"zou",
    devilFruit:null, weapon:null, haki:[],
    summary:"A colossal, ancient elephant that the island of Zou sits atop, still walking the sea after a thousand years under the weight of a promise to Joy Boy.",
    related:[
      {id:"nekomamushi", type:"home to the Mink tribe he carries"},
      {id:"inuarashi", type:"home to the Mink tribe he carries"},
      {id:"joyboy", type:"carries a broken promise made to him during the Void Century"},
    ] },
  { id:"estrid", name:"Estrid", epithet:null, affiliation:"Elbaf Royal Family",
    role:"Loki's mother", status:"unknown", firstSeenAt:"elbaf",
    devilFruit:null, weapon:null, haki:[],
    summary:"Loki's mother, who rejected him at birth after a string of disasters was blamed on omens surrounding his birth.",
    related:[{id:"loki", type:"son, whom she rejected at birth"}] },
];
