// Builds a graphify-compatible graph.json connecting characters, crews,
// devil fruits, ships, organizations, swords, locations, and sagas.
// Every edge here comes straight from explicit structured fields already
// in the curated data files (crew.members, character.related, etc.) —
// no LLM inference needed, since these relationships are facts, not prose.
//
// The auto-fetched generated-full-roster.js (hundreds of stub entries with
// messy, API-translated affiliation strings) is treated as reference-only:
// a stub only becomes a node if something else in the graph actually links
// to it, so the graph doesn't drown in disconnected, low-signal entries.
import { writeFileSync, mkdirSync } from 'fs';

import { STRAWHATS } from '../src/data/characters/strawhats.js';
import { MARINES } from '../src/data/characters/admirals-and-marines.js';
import { WARLORDS_AND_EMPERORS } from '../src/data/characters/warlords-and-emperors.js';
import { WORST_GENERATION } from '../src/data/characters/worst-generation.js';
import { REVOLUTIONARIES } from '../src/data/characters/revolutionaries.js';
import { GIANTS_AND_MINKS } from '../src/data/characters/giants-and-minks.js';
import { SUPPORTING_CAST } from '../src/data/characters/supporting-cast.js';
import { MINOR_CAST_STUBS } from '../src/data/characters/minor-cast-stubs.js';
import { MINOR_CAST_STUBS_2 } from '../src/data/characters/minor-cast-stubs-2.js';
import { MINOR_CAST_STUBS_3 } from '../src/data/characters/minor-cast-stubs-3.js';
import { LEGENDARY_FIGURES } from '../src/data/characters/legendary-figures.js';
import { MINOR_CAST_STUBS_4 } from '../src/data/characters/minor-cast-stubs-4.js';
import { CREWS } from '../src/data/crews.js';
import { LOCATIONS } from '../src/data/locations.js';
import { DEVIL_FRUITS } from '../src/data/devilFruits.js';
import { SHIPS } from '../src/data/ships.js';
import { ORGANIZATIONS } from '../src/data/organizations.js';
import { SWORDS } from '../src/data/swords.js';
import { TIMELINE } from '../src/data/timeline.js';

const CURATED = [
  ...STRAWHATS, ...MARINES, ...WARLORDS_AND_EMPERORS, ...WORST_GENERATION,
  ...REVOLUTIONARIES, ...GIANTS_AND_MINKS, ...SUPPORTING_CAST,
  ...MINOR_CAST_STUBS, ...MINOR_CAST_STUBS_2, ...MINOR_CAST_STUBS_3, ...LEGENDARY_FIGURES, ...MINOR_CAST_STUBS_4,
];

let generatedRoster = [];
try {
  generatedRoster = (await import('../src/data/characters/generated-full-roster.js')).GENERATED_ROSTER || [];
} catch { /* not generated yet — fine, the graph just skips it */ }

// A curated character and its auto-fetched stub counterpart don't always
// share an id (e.g. curated "zoro" vs. the API's "roronoa-zoro"), so an
// id-only filter lets both slip through as separate same-name nodes —
// which broke shortest-path queries (a direct edge to the curated node
// was invisible to anything that resolved to the stub node instead).
// Dedupe by normalized name too, keeping the richer curated entry.
const curatedIds = new Set(CURATED.map(c => c.id));
const curatedNames = new Set(CURATED.map(c => c.name.toLowerCase().replace(/[^a-z]/g, '')));
const ALL_CHARACTERS = [...CURATED, ...generatedRoster.filter(c => {
  if (curatedIds.has(c.id)) return false;
  return !curatedNames.has(c.name.toLowerCase().replace(/[^a-z]/g, ''));
})];
const charById = new Map(ALL_CHARACTERS.map(c => [c.id, c]));

function findCharacterByName(name){
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  return ALL_CHARACTERS.find(c =>
    c.name.toLowerCase() === clean || clean.includes(c.name.toLowerCase())
  ) || null;
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const nodes = new Map();
const links = [];
let skipped = 0;

function addNode(id, label, type){
  if (!nodes.has(id)) nodes.set(id, { id, label, file_type: type, norm_label: label, community: 0 });
  return nodes.get(id);
}
function ensureCharNode(id){
  const c = charById.get(id);
  if (!c) { skipped++; return null; }
  addNode(`char:${id}`, c.name, 'character');
  return `char:${id}`;
}
function addLink(source, target, relation, context){
  if (!source || !target) { skipped++; return; }
  links.push({ source, target, relation, confidence: 'EXTRACTED', confidence_score: 1, weight: 1, context: context || relation });
}

// --- curated characters always get a node; related[] links them to whoever they name ---
// Many characters declare the same bond from both sides (Luffy says "grandfather"
// about Garp, Garp separately says "grandson" about Luffy) — worth keeping both
// files independently readable, but that means naively linking every declared
// relation would double up the edge between them. Dedupe by the pair of people,
// not the wording, so reciprocal entries collapse into the one edge a graph needs.
CURATED.forEach(c => addNode(`char:${c.id}`, c.name, 'character'));
const relatedPairsSeen = new Set();
CURATED.forEach(c => {
  (c.related || []).forEach(rel => {
    const target = ensureCharNode(rel.id);
    if (!target) return;
    const pairKey = [`char:${c.id}`, target].sort().join('|');
    if (relatedPairsSeen.has(pairKey)) return;
    relatedPairsSeen.add(pairKey);
    addLink(`char:${c.id}`, target, 'related_to', rel.type);
  });
});

// --- crews + membership ---
CREWS.forEach(crew => {
  addNode(`crew:${crew.id}`, crew.name, 'crew');
  crew.members.forEach(m => {
    addLink(`crew:${crew.id}`, ensureCharNode(m.id), 'has_member', `${m.role}${m.status !== 'active' ? ` (${m.status})` : ''}`);
  });
});

// --- affiliation fallback: catches characters whose crew/org isn't in a members[] roster ---
const crewByName = new Map(CREWS.map(c => [c.name, c.id]));
const orgByName = new Map(ORGANIZATIONS.map(o => [o.name, o.id]));
ALL_CHARACTERS.forEach(c => {
  if (!c.affiliation) return;
  const crewId = crewByName.get(c.affiliation);
  const orgId = orgByName.get(c.affiliation);
  if (crewId && !links.some(l => l.source === `crew:${crewId}` && l.target === `char:${c.id}`)) {
    addLink(`crew:${crewId}`, ensureCharNode(c.id), 'affiliated_with', c.affiliation);
  }
  if (orgId && !links.some(l => l.source === `org:${orgId}` && l.target === `char:${c.id}`)) {
    addLink(`org:${orgId}`, ensureCharNode(c.id), 'affiliated_with', c.affiliation);
  }
});

// --- devil fruits ---
DEVIL_FRUITS.forEach(f => {
  addNode(`fruit:${f.id}`, f.name, 'devilfruit');
  if (f.currentUser) addLink(ensureCharNode(f.currentUser), `fruit:${f.id}`, 'eats', 'current user');
  (f.formerUsers || []).forEach(u => addLink(ensureCharNode(u), `fruit:${f.id}`, 'formerly_ate', 'former user'));
});

// --- ships (tied to their crew) ---
SHIPS.forEach(s => {
  addNode(`ship:${s.id}`, s.name, 'ship');
  if (s.crew && nodes.has(`crew:${s.crew}`)) addLink(`crew:${s.crew}`, `ship:${s.id}`, 'sails_on', s.status);
});

// --- organizations ---
ORGANIZATIONS.forEach(o => {
  addNode(`org:${o.id}`, o.name, 'organization');
  if (o.leader) addLink(`org:${o.id}`, ensureCharNode(o.leader), 'led_by', 'leader');
  (o.notableMembers || []).forEach(m => {
    if (m !== o.leader) addLink(`org:${o.id}`, ensureCharNode(m), 'has_member', 'notable member');
  });
});

// --- swords ---
SWORDS.forEach(sw => {
  addNode(`sword:${sw.id}`, sw.name, 'sword');
  if (sw.currentOwner) addLink(ensureCharNode(sw.currentOwner), `sword:${sw.id}`, 'wields', sw.grade);
});

// --- sagas, chained in story order ---
TIMELINE.forEach((t, i) => {
  addNode(`saga:${slug(t.saga)}`, t.saga, 'saga');
  if (i > 0) addLink(`saga:${slug(TIMELINE[i - 1].saga)}`, `saga:${slug(t.saga)}`, 'followed_by', `ch. ${t.chapterRange}`);
});

// --- locations: node first (two passes, since links[] can point forward) ---
LOCATIONS.forEach(loc => addNode(`loc:${loc.id}`, loc.name, 'location'));
LOCATIONS.forEach(loc => {
  addLink(`loc:${loc.id}`, `saga:${slug(loc.saga)}`, 'part_of_saga', loc.saga);
  (loc.characters || []).forEach(ref => {
    const found = findCharacterByName(ref.name);
    if (found) addLink(ensureCharNode(found.id), `loc:${loc.id}`, 'appears_at', ref.role);
    else skipped++;
  });
  (loc.links || []).forEach(otherId => {
    if (nodes.has(`loc:${otherId}`)) addLink(`loc:${loc.id}`, `loc:${otherId}`, 'route_to', null);
  });
});

const graph = {
  directed: true,
  multigraph: true,
  graph: { built_by: 'scripts/build-story-graph.mjs', source: 'curated data files — no LLM inference' },
  nodes: [...nodes.values()],
  links,
  hyperedges: [],
};

mkdirSync('story-graph/graphify-out', { recursive: true });
writeFileSync('story-graph/graphify-out/graph.json', JSON.stringify(graph, null, 2));

const byType = {};
graph.nodes.forEach(n => { byType[n.file_type] = (byType[n.file_type] || 0) + 1; });
console.log(`Wrote story-graph/graphify-out/graph.json`);
console.log(`${graph.nodes.length} nodes, ${graph.links.length} links`);
console.log('by type:', byType);
console.log(`${skipped} unresolved references skipped`);
