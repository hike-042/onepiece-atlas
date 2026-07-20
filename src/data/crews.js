/* ============================================================
   CREWS — pirate crews and organizations as graph nodes
   Unlike a character's flat `affiliation` string, a crew here is a
   real entity with its own status and a roster where each member
   carries their OWN status within that crew — because "belongs to
   this crew" isn't permanent. People die, leave, defect, or found
   their own crew after their old one ends.

   Shape:
   {
     id, name,
     status: "active" | "disbanded" | "unknown",
     disbandedContext: string | null   — one line, why/when it ended
     captain: characterId | null,
     members: [
       { id: characterId, status: "active" | "deceased" | "left" | "defected",
         role: string, note: string | null }
     ],
     notes: string | null — one line on why this crew matters structurally
   }

   To add a new crew: copy one entry's shape below. To move a
   character between crews (they left one, joined another), just
   update their entry in BOTH crews' member arrays — this file does
   not try to auto-derive that from character records, since a
   person's crew history often matters more than their current one.
   ============================================================ */

export const CREWS = [
  { id:"strawhats", name:"Straw Hat Pirates", status:"active", disbandedContext:null, captain:"luffy",
    members:[
      { id:"luffy", status:"active", role:"Captain", note:null },
      { id:"zoro", status:"active", role:"Swordsman", note:null },
      { id:"nami", status:"active", role:"Navigator", note:null },
      { id:"usopp", status:"active", role:"Sniper", note:null },
      { id:"sanji", status:"active", role:"Cook", note:null },
      { id:"chopper", status:"active", role:"Doctor", note:null },
      { id:"robin", status:"active", role:"Archaeologist", note:null },
      { id:"franky", status:"active", role:"Shipwright", note:null },
      { id:"brook", status:"active", role:"Musician", note:null },
      { id:"jinbe", status:"active", role:"Helmsman", note:"Joined after leaving the Sun Pirates" },
    ],
    notes:"The only crew every member of the deep-dive Straw Hat tier belongs to, the anchor of the whole graph." },

  { id:"rogerpirates", name:"Roger Pirates", status:"disbanded", disbandedContext:"Disbanded after Gol D. Roger turned himself in ahead of his execution at Loguetown", captain:"roger",
    members:[
      { id:"roger", status:"deceased", role:"Captain", note:"Executed at Loguetown" },
      { id:"rayleigh", status:"active", role:"First Mate", note:"Later trained Luffy in Haki" },
      { id:"shanks", status:"active", role:"Cabin boy at the time", note:"Later founded the Red Hair Pirates" },
      { id:"buggy", status:"active", role:"Cabin boy at the time", note:"Later founded his own crew" },
      { id:"gaban", status:"active", role:"Crew member", note:null },
    ],
    notes:"Every surviving member went on to become a major independent power in their own right." },

  { id:"rockspirates", name:"Rocks Pirates", status:"disbanded", disbandedContext:"Destroyed at the God Valley Incident, roughly 38 years before the present story", captain:"rocks",
    members:[
      { id:"rocks", status:"deceased", role:"Captain", note:"Killed at God Valley" },
      { id:"whitebeard", status:"deceased", role:"Crew member", note:"Later founded the Whitebeard Pirates" },
      { id:"bigmom", status:"active", role:"Crew member", note:"Later founded the Big Mom Pirates" },
      { id:"kaido", status:"active", role:"Crew member", note:"Later founded the Beasts Pirates" },
      { id:"garp", status:"active", role:"Marine present at the incident", note:"Fought against this crew, not a member of it" },
    ],
    notes:"A single legendary crew whose survivors went on to found several of the era's most powerful independent crews, a hidden hub in the graph." },

  { id:"whitebeardpirates", name:"Whitebeard Pirates", status:"disbanded", disbandedContext:"Scattered after Whitebeard's death at the Battle of Marineford", captain:"whitebeard",
    members:[
      { id:"whitebeard", status:"deceased", role:"Captain", note:"Fell at Marineford" },
      { id:"ace", status:"deceased", role:"2nd Division Commander", note:"Executed at Marineford" },
      { id:"marco", status:"active", role:"1st Division Commander", note:null },
      { id:"izo", status:"deceased", role:"16th Division Commander", note:"Died during the Onigashima raid" },
    ] },

  { id:"beastspirates", name:"Beasts Pirates", status:"disbanded", disbandedContext:"Broken apart after Kaido's defeat during the Onigashima raid", captain:"kaido",
    members:[
      { id:"kaido", status:"active", role:"Captain", note:"Defeated, stripped of Emperor status" },
      { id:"queen", status:"active", role:"All-Star", note:null },
      { id:"whoswho", status:"active", role:"All-Star", note:null },
      { id:"ulti", status:"active", role:"Commander", note:null },
      { id:"apoo", status:"active", role:"Allied captain", note:"Independent captain, allied for the arc" },
      { id:"drake", status:"active", role:"Allied captain", note:"Revealed as an undercover Revolutionary agent" },
      { id:"orochi", status:"deceased", role:"Installed puppet shogun of Wano", note:"Not a crew member, but ruled on Kaido's behalf" },
    ] },

  { id:"bigmompirates", name:"Big Mom Pirates", status:"active", disbandedContext:null, captain:"bigmom",
    members:[
      { id:"bigmom", status:"active", role:"Captain", note:null },
      { id:"katakuri", status:"active", role:"Sweet Commander", note:null },
      { id:"pudding", status:"active", role:"Daughter", note:null },
      { id:"pekoms", status:"left", role:"Former officer", note:"Left to return home to Zou" },
    ] },

  { id:"blackbeardpirates", name:"Blackbeard Pirates", status:"active", disbandedContext:null, captain:"blackbeard",
    members:[
      { id:"blackbeard", status:"active", role:"Captain", note:"Formerly of the Whitebeard Pirates, defected" },
    ] },

  { id:"kidpirates", name:"Kid Pirates", status:"active", disbandedContext:null, captain:"kid",
    members:[
      { id:"kid", status:"active", role:"Captain", note:null },
      { id:"killer", status:"active", role:"First Mate", note:null },
    ] },

  { id:"heartpirates", name:"Heart Pirates", status:"active", disbandedContext:null, captain:"law",
    members:[
      { id:"law", status:"active", role:"Captain", note:"Formerly of the Donquixote Pirates, left before the story began" },
      { id:"bepo", status:"active", role:"Navigator", note:null },
    ] },

  { id:"redhairpirates", name:"Red Hair Pirates", status:"active", disbandedContext:null, captain:"shanks",
    members:[
      { id:"shanks", status:"active", role:"Captain", note:"Formerly of the Roger Pirates" },
      { id:"uta", status:"deceased", role:"Adoptive daughter", note:"Raised aboard the crew" },
    ] },

  { id:"sunpirates", name:"Sun Pirates", status:"disbanded", disbandedContext:"Scattered after founder Fisher Tiger's death", captain:"fishertiger",
    members:[
      { id:"fishertiger", status:"deceased", role:"Founder", note:null },
      { id:"jinbe", status:"left", role:"Former officer", note:"Left to join the Straw Hats" },
      { id:"arlong", status:"left", role:"Former officer", note:"Broke away to found the Arlong Pirates" },
    ] },

  { id:"arlongpirates", name:"Arlong Pirates", status:"disbanded", disbandedContext:"Defeated by the Straw Hats at Coco Village", captain:"arlong",
    members:[
      { id:"arlong", status:"active", role:"Captain", note:"Defeated, crew driven out" },
    ] },

  { id:"revolutionaryarmy", name:"Revolutionary Army", status:"active", disbandedContext:null, captain:"dragon",
    members:[
      { id:"dragon", status:"active", role:"Leader", note:null },
      { id:"sabo", status:"active", role:"Chief of Staff", note:null },
      { id:"ivankov", status:"active", role:"Commander", note:null },
      { id:"koala", status:"active", role:"Agent", note:null },
      { id:"drake", status:"active", role:"Undercover agent", note:"Publicly known as a pirate captain" },
    ] },

  { id:"crossguild", name:"Cross Guild", status:"active", disbandedContext:null, captain:null,
    members:[
      { id:"crocodile", status:"active", role:"Co-founder", note:"Formerly a Warlord" },
      { id:"buggy", status:"active", role:"Co-founder", note:null },
    ],
    notes:"A bounty-hunting organization, not a traditional pirate crew, openly hunts other pirates instead of hiding from the Navy." },

  { id:"donquixotepirates", name:"Donquixote Pirates", status:"disbanded", disbandedContext:"Broken apart after Doflamingo's defeat at Dressrosa", captain:"doflamingo",
    members:[
      { id:"doflamingo", status:"active", role:"Captain", note:"Imprisoned after Dressrosa" },
      { id:"law", status:"left", role:"Former subordinate", note:"Left before founding the Heart Pirates" },
      { id:"vergo", status:"deceased", role:"Double agent inside the Navy", note:null },
      { id:"caesar", status:"left", role:"Weapons scientist", note:"Allied, then abandoned by the crew after Punk Hazard" },
    ] },
];

export function findCrewById(id){
  return CREWS.find(c => c.id === id) || null;
}

/** Finds every crew a given character has ever appeared in, current or past. */
export function crewsForCharacter(characterId){
  return CREWS.filter(c => c.members.some(m => m.id === characterId));
}
