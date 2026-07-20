import { CHARACTERS } from './data/characters/index.js';
import { DEVIL_FRUITS } from './data/devilFruits.js';
import { LOCATIONS } from './data/locations.js';

/** Picks n random distinct items from an array. */
function sample(arr, n){
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length){
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

function fruitQuestion(){
  const fruits = DEVIL_FRUITS.filter(f => f.currentUser);
  const target = fruits[Math.floor(Math.random() * fruits.length)];
  const owner = CHARACTERS.find(c => c.id === target.currentUser);
  if (!owner) return null;

  const wrongPool = CHARACTERS.filter(c => c.id !== owner.id && c.name);
  const options = sample(wrongPool, 3).map(c => c.name);
  options.push(owner.name);
  options.sort(() => Math.random() - 0.5);

  return {
    prompt: `Who currently has the ${target.name}?`,
    options,
    answer: owner.name,
  };
}

function locationQuestion(){
  const withChars = LOCATIONS.filter(l => l.characters && l.characters.length);
  const loc = withChars[Math.floor(Math.random() * withChars.length)];
  const person = loc.characters[Math.floor(Math.random() * loc.characters.length)];

  const wrongPool = LOCATIONS.filter(l => l.id !== loc.id);
  const options = sample(wrongPool, 3).map(l => l.name);
  options.push(loc.name);
  options.sort(() => Math.random() - 0.5);

  return {
    prompt: `"${person.name}" (${person.role}) is tied to which location?`,
    options,
    answer: loc.name,
  };
}

function bountyQuestion(){
  const withBounty = CHARACTERS.filter(c => c.bounty);
  const picks = sample(withBounty, 2);
  if (picks.length < 2) return null;
  const [a, b] = picks;
  const parseBounty = (s) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0;
  const higher = parseBounty(a.bounty) >= parseBounty(b.bounty) ? a : b;

  return {
    prompt: `Who has the higher bounty: ${a.name} or ${b.name}?`,
    options: [a.name, b.name],
    answer: higher.name,
  };
}

const GENERATORS = [fruitQuestion, locationQuestion, bountyQuestion];

/** Returns a single random quiz question, retrying generators if one
 *  comes back empty (e.g. not enough data for that type yet). */
export function generateQuestion(){
  for (let i = 0; i < 10; i++){
    const gen = GENERATORS[Math.floor(Math.random() * GENERATORS.length)];
    const q = gen();
    if (q) return q;
  }
  return null;
}
