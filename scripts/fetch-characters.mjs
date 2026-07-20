// Run with: node scripts/fetch-characters.mjs
// Requires Node 18+ (for built-in fetch).
//
// Calls the free One Piece API server-side, which sidesteps its disabled
// CORS policy (a browser can't call it directly, but Node isn't subject
// to that restriction). Writes a flat, auto-generated roster covering
// every named character the API knows about, so nothing is left uncovered
// even at the stub level. Hand-curated files still take priority for
// anyone who also has a real summary written for them — see
// data/characters/character-schema.md.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_URL = 'https://api.api-onepiece.com/v2/characters/en';
const OUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/data/characters/generated-full-roster.js'
);

function slugify(name){
  return name
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Strips accent marks (caf\u00e9 -> cafe) without altering letter order \u2014
 *  a mechanical anglicization, not a translation, so it's safe to apply
 *  even to names we don't otherwise recognize. */
function stripDiacritics(s){
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

// The API's own /en endpoint still leaves plenty of `crew`/affiliation
// names in French \u2014 this is a translation dictionary for the ones
// that have shown up in practice, built from known One Piece canon
// terms where we have them (matching this repo's own crews.js /
// locations.js / glossary.js spellings) and a literal, structural
// translation otherwise. Anything not listed here just falls back to
// accent-stripping, so nothing French-looking makes it to the site.
const AFFILIATION_TRANSLATIONS = {
  "Anciens membres de la Marine": "Former Marine",
  "Anciens membres du Baroque Works": "Former Baroque Works",
  "Anciens membres du Cipher Pol": "Former Cipher Pol",
  "Archipel Conomi": "Conomi Islands",
  "Archipel de Boing": "Boin Archipelago",
  "Archipel des Argao": "Argao Archipelago",
  "Archipel des Gecko": "Gecko Islands",
  "Archipel des Sabaody": "Sabaody Archipelago",
  "Armarda du Chapeau de Paille": "Straw Hat Grand Fleet",
  "Arm\u00e9e R\u00e9volutionnaire": "Revolutionary Army",
  "Cap des Jumeaux": "Twin Cape",
  "Dragon C\u00e9lestes": "Celestial Dragons",
  "Equipage de Bellamy": "Bellamy's Crew",
  "Equipage de Bigalo": "Bigalo's Crew",
  "Erbaf": "Elbaf",
  "Esclave": "Slave",
  "Faux Equipage du Chapeau de Paille": "Fake Straw Hat Crew",
  "Fleet Yonta Maria": "Yonta Maria Fleet",
  "Fr\u00e8res Voleurs": "Thief Brothers",
  "\u00cele aux cactus": "Cactus Island",
  "\u00cele d'Asuka": "Asuka Island",
  "\u00cele de Drum": "Drum Island",
  "\u00cele de Mecha": "Mecha Island",
  "\u00cele des animaux \u00e9tranges": "Island of Strange Animals",
  "\u00cele des hommes-poissons": "Fish-Man Island",
  "L'\u00c9quipage des Maquereaux": "Mackerel Crew",
  "La lune": "The Moon",
  "Le Roux crew": "Red Hair Pirates",
  "Marine": "Marines",
  "N\u00e9o Marine": "Neo Marines",
  "Pays des Wa": "Wano Country",
  "Pays des fleurs": "Land of Flowers",
  "Pirate Moustachus": "Mustached Pirate",
  "Pirate au foyer": "Homemaker Pirate",
  "Pirate des fl\u00e8ches rouges": "Red Arrows Pirate",
  "Royaume de Germa": "Germa Kingdom",
  "Royaume de Goa": "Goa Kingdom",
  "Royaume de Lvneel": "Lvneel Kingdom",
  "Royaume de Mogalo": "Mogalo Kingdom",
  "Royaume de Prodence": "Prodence Kingdom",
  "Royaume mal\u00e9fique de Black Drum": "Evil Kingdom of Black Drum",
  "Source de l'insouciance": "Spring of Carefreeness",
  "The Chapeau de Paille crew": "Straw Hat Pirates",
  "The crew of Barbe Brune": "Brownbeard's Crew",
  "The crew of Les Moines D\u00e9prav\u00e9s": "Depraved Monks Crew",
  "The crew of the Lion d'Or": "Golden Lion Crew",
  "Village de Shimotsuki": "Shimotsuki Village",
  "Zo": "Zou",
};

const ROLE_TRANSLATIONS = {
  "Resident of vilalge de Sirop": "Resident of Syrup Village",
  "Owner Caf\u00e9 des Sir\u00e8nes": "Owner of the Mermaid Cafe",
  "Caf\u00e9 des Sir\u00e8nes employee": "Mermaid Cafe employee",
};

// A handful of names carry a French descriptor baked in rather than
// being pure proper nouns \u2014 translated here for the same reason as
// affiliations/roles above.
const NAME_TRANSLATIONS = {
  "Baggy / Le Clown": "Buggy / the Clown",
  "Charlotte Dent-de-chien": "Charlotte Dogtooth",
  "Charlotte De-Chat": "Charlotte Cat",
};

function translate(value, dictionary){
  if (!value) return value;
  return dictionary[value] || stripDiacritics(value);
}

async function main(){
  console.log(`Fetching character roster from ${API_URL} ...`);
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  const raw = await res.json();

  const seen = new Set();
  const roster = raw
    .filter(entry => entry && entry.name)
    .map(entry => {
      let id = slugify(entry.name);
      let n = 2;
      while (seen.has(id)) { id = `${slugify(entry.name)}-${n++}`; }
      seen.add(id);
      return {
        id,
        name: stripDiacritics(translate(entry.name, NAME_TRANSLATIONS)),
        epithet: null,
        affiliation: translate(entry.crew?.name || entry.affiliation || 'Unknown', AFFILIATION_TRANSLATIONS),
        role: translate(entry.job || 'Unknown', ROLE_TRANSLATIONS),
        status: 'unknown',
        firstSeenAt: null,
      };
    });

  const fileContents =
`// AUTO-GENERATED by scripts/fetch-characters.mjs — do not hand-edit.
// Regenerate with: node scripts/fetch-characters.mjs
// Source: ${API_URL}
// Generated: ${new Date().toISOString()}

export const GENERATED_ROSTER = ${JSON.stringify(roster, null, 2)};
`;

  await writeFile(OUT_PATH, fileContents, 'utf-8');
  console.log(`Wrote ${roster.length} characters to ${OUT_PATH}`);
}

main().catch(err => {
  console.error('Failed to fetch character roster:', err.message);
  console.error('The site still works fine without this file — hand-curated');
  console.error('characters load regardless. Re-run this script once the');
  console.error('API is reachable.');
  process.exit(1);
});
