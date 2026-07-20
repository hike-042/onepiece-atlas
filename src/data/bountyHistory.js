/* ============================================================
   BOUNTY HISTORY — multi-point bounty progressions over the story.

   Per CLAUDE.md: never fabricate a bounty. A character's `bounty`
   field elsewhere in this codebase is a single current snapshot: this
   file is for actual historical progressions, which is a much higher
   bar of confidence to source correctly at every point.

   Only add an entry here when every point in the sequence is a
   well-documented, independently-verifiable published figure — not
   an estimate or interpolation. Luffy's is included because his
   bounty jumps are among the most repeated, cross-confirmed facts
   in the franchise (official chapters, Viz volumes, databooks all
   agree). Leave a character out entirely rather than guess at a
   number for them — the bar-chart page falls back to their single
   current `bounty` snapshot instead, which is what index.js already
   has sourced.
   ============================================================ */

export const BOUNTY_HISTORY = [
  {
    characterId: "luffy",
    points: [
      { saga: "East Blue Saga", bounty: 30000000 },
      { saga: "Alabasta Saga", bounty: 100000000 },
      { saga: "Water 7 Saga", bounty: 300000000 },
      { saga: "Summit War Saga", bounty: 400000000 },
      { saga: "Dressrosa Saga", bounty: 500000000 },
      { saga: "Four Emperors Saga", bounty: 1500000000 },
      { saga: "Final Saga", bounty: 3000000000 },
    ],
  },
];
