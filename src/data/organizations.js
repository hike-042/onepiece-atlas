/* ============================================================
   ORGANIZATIONS — non-pirate-crew institutions: Navy branches,
   intelligence units, and criminal organizations. Kept separate
   from crews.js because these operate on different rules (rank
   structure, government backing) rather than captain/crew loyalty.
   ============================================================ */

export const ORGANIZATIONS = [
  { id:"marines", name:"The Marines", type:"Military", status:"active",
    leader:"akainu",
    notableMembers:["akainu","aokiji","kizaru","fujitora","garp","smoker","tashigi","coby","sengoku"],
    note:"The World Government's military force, tasked with suppressing piracy. Its own ranks are far from uniformly aligned on what 'justice' should mean." },
  { id:"world-government", name:"The World Government", type:"Governing body", status:"active",
    leader:null,
    notableMembers:["imu","fiveelders","charlos"],
    note:"A global governing alliance nominally representing member nations, in practice dominated by the Celestial Dragons and whatever Imu actually is." },
  { id:"cp9", name:"Cipher Pol No. 9 (CP9)", type:"Intelligence unit", status:"disbanded",
    leader:"spandam",
    notableMembers:["spandam","lucci","kaku","kalifa","blueno","jabra","kumadori"],
    note:"A secret assassination and information unit operating with authority that officially doesn't exist, broken up after their operation at Enies Lobby failed." },
  { id:"baroque-works", name:"Baroque Works", type:"Criminal organization", status:"disbanded",
    leader:"crocodile",
    notableMembers:["crocodile","robin"],
    note:"A numbers-and-codenames criminal syndicate secretly run by Crocodile to seize Alabasta's throne, collapsed once its president was exposed." },
  { id:"revolutionary-army-ref", name:"Revolutionary Army", type:"Insurgency", status:"active",
    leader:"dragon",
    notableMembers:["dragon","sabo","ivankov","koala"],
    note:"See src/data/crews.js for this one's full member roster, listed here too since it functions more like a military than a pirate crew." },
  { id:"vegapunk-satellites", name:"Vegapunk's Satellite Program", type:"Research initiative", status:"active",
    leader:"vegapunk",
    notableMembers:["vegapunk","stussy"],
    note:"Dr. Vegapunk's work distributed across multiple android/clone satellites, each reportedly handling a different field of research." },
  { id:"cross-guild-ref", name:"Cross Guild", type:"Bounty-hunting organization", status:"active",
    leader:null,
    notableMembers:["crocodile","buggy"],
    note:"See src/data/crews.js, included here too since it's structured as a business, not a traditional pirate crew." },
];

export function findOrganizationById(id){
  return ORGANIZATIONS.find(o => o.id === id) || null;
}

export function organizationsForCharacter(characterId){
  return ORGANIZATIONS.filter(o => o.leader === characterId || o.notableMembers.includes(characterId));
}
