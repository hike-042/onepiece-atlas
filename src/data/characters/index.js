import { STRAWHATS } from './strawhats.js';
import { MARINES } from './admirals-and-marines.js';
import { WARLORDS_AND_EMPERORS } from './warlords-and-emperors.js';
import { WORST_GENERATION } from './worst-generation.js';
import { REVOLUTIONARIES } from './revolutionaries.js';
import { GIANTS_AND_MINKS } from './giants-and-minks.js';
import { SUPPORTING_CAST } from './supporting-cast.js';
import { MINOR_CAST_STUBS } from './minor-cast-stubs.js';
import { MINOR_CAST_STUBS_2 } from './minor-cast-stubs-2.js';
import { MINOR_CAST_STUBS_3 } from './minor-cast-stubs-3.js';
import { LEGENDARY_FIGURES } from './legendary-figures.js';
import { MINOR_CAST_STUBS_4 } from './minor-cast-stubs-4.js';

/* ============================================================
   To add a new hand-curated character, append to whichever shard
   file fits best (or create a new shard and import it here).
   generated-full-roster.js (built by scripts/fetch-characters.mjs)
   is merged in last and only fills in names this file doesn't
   already cover, so hand-curated entries always take priority.
   ============================================================ */

let generatedRoster = [];
try {
  const mod = await import('./generated-full-roster.js');
  generatedRoster = mod.GENERATED_ROSTER || [];
} catch {
  // Not generated yet — run `node scripts/fetch-characters.mjs` to create it.
  generatedRoster = [];
}

const CURATED = [
  ...STRAWHATS,
  ...MARINES,
  ...WARLORDS_AND_EMPERORS,
  ...WORST_GENERATION,
  ...REVOLUTIONARIES,
  ...GIANTS_AND_MINKS,
  ...SUPPORTING_CAST,
  ...MINOR_CAST_STUBS,
  ...MINOR_CAST_STUBS_2,
  ...MINOR_CAST_STUBS_3,
  ...LEGENDARY_FIGURES,
  ...MINOR_CAST_STUBS_4,
];

const curatedIds = new Set(CURATED.map(c => c.id));
const stubsOnly = generatedRoster.filter(c => !curatedIds.has(c.id));

export const CHARACTERS = [...CURATED, ...stubsOnly];

export function findCharacterByName(name){
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  return CHARACTERS.find(c =>
    c.name.toLowerCase() === clean || clean.includes(c.name.toLowerCase())
  ) || null;
}

export function findCharacterById(id){
  return CHARACTERS.find(c => c.id === id) || null;
}
