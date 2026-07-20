# Project Map

A WebGL graph of this codebase's own file structure and import
relationships — the "point a graph tool at this folder" idea, built
by hand since no such skill was available to run directly.

## What it shows

- **Folder nodes** (gold) connected to their contents with thin
  "contains" edges — the same hierarchy `find` would show you, just
  spatial instead of indented text.
- **Import edges** (bright gold, animated) — pulled directly from the
  real `import` statements in the source via `grep -rn "^import"`,
  not guessed. `src/main.js` fans out to almost everything because
  it's the orchestrator; `src/data/locations.js` and `src/data/crews.js`
  have no outgoing edges because they're pure data with no imports.
- **generated-full-roster.js** appears even though it may not exist on
  disk yet — it's connected with a dashed-style dynamic-import edge
  from `characters/index.js` and a "writes" edge from
  `scripts/fetch-characters.mjs`, showing the relationship that
  exists in the code regardless of whether you've run the script yet.

## Running it

Same rule as the main site — this needs real internet access for the
Three.js/3d-force-graph CDN imports, so serve it, don't just open the
file directly:

```bash
cd tools/project-map
npx serve .
```

Then open the printed `localhost` URL.

## Keeping it accurate

This is a hand-maintained snapshot, not a live parser — if you add a
new file or import, update `graph-data.js` to match. For a repo this
size that's a two-minute edit; if the project grows enough that this
becomes tedious, that's the point where a real static-analysis tool
(a dependency-graph plugin, or an AI skill like Graphify pointed at
the repo) would start paying for itself over hand-editing.
