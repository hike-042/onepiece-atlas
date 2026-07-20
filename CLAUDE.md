# CLAUDE.md — instructions for Claude Code working in this repo

This file is read automatically by Claude Code. It exists so that when
Arco asks for the atlas to be updated for a new chapter, arc, or
character, the agent handles it consistently and safely without
re-deriving the rules from scratch each time.

## What this project is

A WebGL globe (`index.html` → `src/main.js`) charting the world of One
Piece, plus a 3D character/crew relationship graph (`src/scene/characterGraph.js`,
powered by `3d-force-graph`). All content is original — no manga/anime
prose, dialogue, or artwork is reproduced anywhere in this repo. See
`character-schema.md` for the full data shape and `src/data/crews.js`'s
top comment for how crews are modeled.

Beyond locations, characters, and crews, the brain also includes:
- `src/data/devilFruits.js` — a standalone fruit catalog, since a fruit's
  identity outlives any one user (some pass hands, some are destroyed)
- `src/data/glossary.js` — recurring world-building terms, explained once
  (opened via the "📖 Glossary" button in the app)
- `src/data/timeline.js` — sagas in order with approximate chapter ranges
  and real-world publication windows
- `src/data/ships.js` — notable vessels, linked to the crew that sails them
- `src/data/organizations.js` — non-pirate-crew institutions (Marines,
  CP9, Baroque Works, Vegapunk's satellites) — kept separate from
  `crews.js` since these run on rank structure, not captain/crew loyalty
- `src/data/swords.js` — named blades that pass between owners
- `src/trivia.js` — generates live quiz questions from the data above,
  opened via the "🧭 Quiz" button

## Setup

```bash
npm install
npm run dev            # main atlas
# open the printed localhost URL, and /tools/project-map/ for the codebase graph
```

## The core rule for adding anything new

**Facts, not prose.** When pulling information from any external
source (a wiki, a fan site, official Shonen Jump/Viz release notes,
the free `api.api-onepiece.com` API), extract only: names, affiliations,
dates, numeric stats (bounty, chapter number), and relationships. Never
copy sentences, paragraphs, or structure from the source. Every
`summary`, `dream`, `devilFruit.effect`, and `related[].type` string in
this codebase must be freshly written, not paraphrased-in-place from
someone else's writing. This isn't a style preference — it's a hard
requirement for this repo. If asked to "pull everything" from a page,
extract structured facts into stub entries (see `minor-cast-stubs*.js`
for the pattern) rather than transcribing prose.

## Automated checking (scheduled, human-approved)

`.github/workflows/check-new-chapter.yml` polls hourly through the known
Sunday release window (14:00–20:00 UTC, covering the ~16:00 UTC official
digital release with margin either side), plus a Monday fallback for
delayed weeks — there's no official webhook for "chapter just published,"
so tight polling around the known window is the practical substitute for
instant notification. A small dedupe state file
(`scripts/.chapter-check-state.json`) tracks the last chapter number
already drafted, so the six-times-an-hour polling doesn't open six
duplicate pull requests for the same chapter — only the first run to
confirm a given chapter opens a PR.
strict system prompt: it only accepts confirmation from official
sources (Viz Media, MangaPlus/Shueisha, Shonen Jump's official
accounts, or licensed news outlets citing an official release) and
requires at least two independent qualifying sources — it explicitly
refuses leak/spoiler-tier accounts regardless of their apparent
credibility, since this fandom has a persistent problem with troll
accounts posting convincing fake leaks.

If it finds a confirmed update, it writes a JSON draft to
`draft-updates/` and the workflow opens a pull request — it never
writes to the actual data files or merges anything on its own. A human
(you, or Claude Code acting on your explicit instruction) reviews the
`confirmedBy` sources, then manually incorporates the facts following
the workflow above.

**Setup required:** add an `ANTHROPIC_API_KEY` repo secret in GitHub
(Settings → Secrets and variables → Actions) for the workflow to run.
Without it, the scheduled job will fail loudly rather than silently
doing nothing.

## Workflow: a new chapter/arc has been published

Follow this sequence:

1. **Check for new named characters or locations.**
   Search official sources first (Shonen Jump/Viz chapter summaries,
   `api.api-onepiece.com/v2/characters/en`, `.../v2/sagas/en`), and
   cross-reference against the One Piece Fandom wiki for facts only —
   never copy its prose.

2. **New location →** append to `src/data/locations.js`. Follow the
   `lat`/`lon` cheat sheet in that file's header comment for placement
   relative to the Red Line and Grand Line. Give it a fresh, original
   `summary` and `events` list. If status `"current"` needs to move to
   this new location, flip the previous current location to
   `"explored"` first — `main.js`'s Thousand Sunny tracker follows
   whichever location has `status: "current"` automatically, so this
   one edit is the only thing that needs to change for the ship marker
   to relocate.

3. **New character →** decide curated vs. stub tier (see
   `character-schema.md`). Major/recurring characters get a full entry
   in the relevant themed file under `src/data/characters/` (devilFruit,
   bounty, dream, weapon, haki, related — see `strawhats.js` for the
   fullest example). Minor/one-off characters go into a
   `minor-cast-stubs-N.js` file as bare facts only, no `summary`.

4. **New or changed crew membership →** update `src/data/crews.js`.
   If someone dies, defected, or left, update their `status` within
   that crew's `members` array — don't delete the entry, since past
   membership is part of the graph's value. If an entirely new crew is
   introduced, add a new entry following the shape documented at the
   top of that file.

5. **Refresh the stub roster (optional, for broad coverage):**
   ```bash
   npm run sync-characters
   ```
   This runs `scripts/fetch-characters.mjs`, which calls the public API
   server-side (bypassing its CORS restriction) and regenerates
   `src/data/characters/generated-full-roster.js`. It never overwrites
   curated entries — `src/data/characters/index.js` merges curated
   first, stubs only fill gaps.

6. **Update the codebase graph if the file structure changed →**
   `tools/project-map/graph-data.js` is hand-maintained (see that
   folder's README). Add nodes/edges for any new file.

7. **Sanity check before finishing:** every `id` referenced in a
   `related` array or a crew's `members` array must exist somewhere in
   `CHARACTERS` (from `src/data/characters/index.js`), or the graph
   will silently drop that link. Grep for the id across
   `src/data/characters/*.js` if unsure.

## Using Graphify on this repo

[Graphify](https://github.com/Graphify-Labs/graphify) is a separate
Claude Code skill (not bundled in this repo) that turns a folder into
a navigable knowledge graph — useful for exploring the codebase itself,
as opposed to `tools/project-map/`, which visualizes the *One Piece
world's* character/crew data.

To install it:
```bash
npm run graphify
# equivalent to: npx skills add Graphify-Labs/graphify
```
Then, in a Claude Code session: *"Use graphify to map the relationships
in this project."* If Graphify isn't available in your environment,
`tools/project-map/` is the hand-built fallback — its `graph-data.js`
needs manual updates when files/imports change, documented in its own
README.

## What never to do

- Never paste manga/anime dialogue, narration, or wiki prose directly
  into any data file, comment, or commit message.
- Never fabricate a bounty, devil fruit name, or plot event — if unsure,
  leave the field `null`/omitted rather than guessing.
- Never delete a deceased or former crew member from `crews.js` — mark
  their status instead of removing them.
