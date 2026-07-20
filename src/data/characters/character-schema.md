# Character data schema

Every character record, whether hand-curated or auto-generated, follows this
shape:

```js
{
  id: "unique-slug",              // required, used for links and lookups
  name: "Full Name",               // required
  epithet: "Alias or title, or null",
  affiliation: "Crew / organization name",
  role: "Short phrase — captain, doctor, admiral, etc.",
  status: "alive" | "deceased" | "unknown",
  firstSeenAt: "location-id",      // must match an id in data/locations.js
  summary: "One sentence, your own words. Omit for auto-generated stubs.",
  related: [                       // optional — drives the character graph
    { id: "other-character-id", type: "mentor | rival | crewmate | family | ..." }
  ],
}
```

## Two tiers of data

**Hand-curated** (`strawhats.js`, `admirals-and-marines.js`,
`warlords-and-emperors.js`, `worst-generation.js`, `revolutionaries.js`,
`giants-and-minks.js`, `supporting-cast.js`) — characters worth a real
summary and relationship detail. Add new entries here when you want the
panel and character graph to say something meaningful about someone.

**Generated** (`generated-full-roster.js`) — produced by running
`node scripts/fetch-characters.mjs`. This is a flat list pulled from the
public One Piece API, one entry per named character it knows about, with
`summary` and `related` left out. It exists so a search never comes up
completely empty, even for a character nobody's written a blurb for yet.
`data/characters/index.js` merges both tiers automatically, and a
hand-curated entry always wins if the same id shows up in both.

## Adding a hand-curated character

1. Pick the shard file that fits (or start a new one and import it in
   `index.js`).
2. Append an object following the shape above.
3. If you want them to appear in the 3D character graph connected to
   someone else, add a `related` entry on either side (or both).

## Regenerating the full roster

```bash
node scripts/fetch-characters.mjs
```

Run this again whenever new chapters introduce named characters you want
covered at the stub level. It overwrites `generated-full-roster.js` in
full — don't hand-edit that file, since your changes would be lost on the
next run.
