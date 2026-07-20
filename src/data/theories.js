/* ============================================================
   THEORIES — a tracker for fan speculation about still-unconfirmed
   Void Century / world-history lore, most recently fueled by the
   "history mural" shown late in the story (around Ch. 1138).

   This file exists specifically so speculation stays labeled as
   speculation instead of quietly blending into confirmed data
   elsewhere in the atlas. Every entry here is:
     - written in our own words (never copied from any fan essay,
       video transcript, or the manga's own captions/dialogue),
     - explicitly a THEORY, not a claim about canon,
     - carrying a `status` field meant to be flipped as real chapters
       confirm, contradict, or partially confirm it.

   Shape:
   {
     id: "unique-slug",
     subject: "What's actually depicted/observed (the neutral fact)",
     theory: "What fans read into it, paraphrased, hedged",
     status: "unconfirmed" | "partially-confirmed" | "confirmed" | "contradicted",
     icon: one of ICONS below (original glyph, drawn per-page — not manga art),
     since: "Chapter ### or arc name this theory picked up steam",
     confirmedNote: "Filled in later, in our own words, once canon weighs in — or null",
   }

   Never store: the actual mural artwork, a fan theorist's exact prose,
   or manga dialogue/captions. If a theory can't be paraphrased without
   quoting the source, it doesn't belong here.
   ============================================================ */

export const THEORY_ERAS = [
  {
    id: 'first-world',
    label: 'The "First World"',
    blurb: 'A fan reading (not official terminology) of the mural\'s earliest panel: an advanced, pre-Void-Century civilization that discovers a nuclear-like power source, over-industrializes, and is wiped out in a cataclysm.',
  },
  {
    id: 'second-world',
    label: 'The "Second World"',
    blurb: 'The fan reading of the mural\'s middle panel, roughly matching the Void Century as already known: devil fruits emerging, an ancient weapon used in war, and a great flood.',
  },
  {
    id: 'third-world',
    label: 'The "Third World"',
    blurb: 'The fan reading of the mural\'s final panel: a hoped-for future battle where the story\'s major races unite against a shared threat.',
  },
];

export const THEORIES = [
  {
    id: 'pre-void-advanced-civilization',
    era: 'first-world',
    subject: 'The mural depicts a skyline of tall, smoke-stacked buildings with visible gears and machinery beneath the city.',
    theory: 'Read as an advanced civilization that existed before the Void Century, one that discovered some kind of powerful, reactor-like energy source and used it to industrialize rapidly.',
    status: 'unconfirmed',
    icon: 'city',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'stratified-ascension',
    era: 'first-world',
    subject: 'Two lines of figures climb a stairway/elevator in the mural, one group carrying cargo, the other unburdened and gaining a halo near the top.',
    theory: 'Read as an early class divide: a laboring underclass versus a privileged class ascending to a higher, god-like status, possibly foreshadowing how the Celestial Dragons\' elevated status began.',
    status: 'unconfirmed',
    icon: 'stairs',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'serpent-as-red-line',
    era: 'first-world',
    subject: 'A colossal serpent coils out of the city in the mural, breathing fire across the land.',
    theory: 'Read by fans as an origin story for the Red Line itself: that the continent-spanning landmass was once described in myth as a giant snake.',
    status: 'unconfirmed',
    icon: 'serpent',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'sun-tree-devil-fruit-origin',
    era: 'second-world',
    subject: 'A single colossal tree, hung with round fruit-like shapes, sits at the center of the mural\'s middle panel.',
    theory: 'Read as a depiction of the tree already referenced in canon as connected to every Devil Fruit\'s origin, here shown as the source all fruits grew from.',
    status: 'partially-confirmed',
    icon: 'tree',
    since: 'Ch. 1138',
    confirmedNote: 'A single tree tied to Devil Fruit origins has been referenced in canon before this mural; the mural itself is still just an artistic depiction, not new confirmation.',
  },
  {
    id: 'flying-ship-ancient-weapon',
    era: 'second-world',
    subject: 'A ship-like shape in the sky fires a bolt of energy down at a small crowned figure below.',
    theory: 'Read as one of the three ancient weapons being used against a ruler figure during a great flood, with the ship-shaped object beneath the tree read as a second ancient weapon, stalled mid-mission.',
    status: 'unconfirmed',
    icon: 'ship',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'large-dragon-figure',
    era: 'second-world',
    subject: 'A large dragon shape looms over the crowned figure in the mural\'s middle panel, clashing with the serpent from the first panel.',
    theory: 'Some fans read this as a dragon form tied to the crowned figure himself, rather than a separate character, though the mural blends its panels together enough that this is one of the shakier reads.',
    status: 'unconfirmed',
    icon: 'dragon',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'united-races-final-battle',
    era: 'third-world',
    subject: 'The mural\'s final panel shows a central rubbery figure holding a shield and sword, surrounded by a wide mix of clearly different races and peoples riding out together on many small boats.',
    theory: 'Read as a hoped-for future (or Void Century echo) where humans, giants, minks, merfolk, and other peoples set aside old conflicts to fight side by side against a shared threat.',
    status: 'unconfirmed',
    icon: 'allies',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'ancient-giant-ally',
    era: 'third-world',
    subject: 'One of the allied figures in the mural\'s final panel is unmistakably giant-sized and wears a horned, Viking-style helmet.',
    theory: 'Read as the first real hint that giants, potentially ancestors of the Elbaf giants, fought alongside the central figure in an earlier era.',
    status: 'unconfirmed',
    icon: 'giant',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
  {
    id: 'mermaid-princess-lineage',
    era: 'third-world',
    subject: 'A crowned mermaid figure holding a trident appears among the allied figures.',
    theory: 'Read as an ancestor of Fish-Man Island\'s Mermaid Princess line, tying the current royal family back to this much older era.',
    status: 'unconfirmed',
    icon: 'trident',
    since: 'Ch. 1138',
    confirmedNote: null,
  },
];

export const THEORY_ICONS = ['city', 'stairs', 'serpent', 'tree', 'ship', 'dragon', 'allies', 'giant', 'trident'];
