# The Grand Line Atlas

An original, fan-made interactive WebGL globe charting the world of One Piece —
not affiliated with Eiichiro Oda, Shueisha, or Toei Animation. All map artwork,
landmark models, and location summaries are original work, not traced or
copied from the manga/anime.

## Running it locally

This is now a real npm project (Three.js, `3d-force-graph`, and Vite
are installable dependencies, not CDN scripts), so:

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. The codebase's own file/import graph
lives at `tools/project-map/` — visit that path in the dev server, or
run `npm run build && npm run preview` for a production build (both
`index.html` and `tools/project-map/index.html` are built as separate
entry points, configured in `vite.config.js`).

See `CLAUDE.md` for the full playbook Claude Code follows when
extending this project for a new chapter or arc.

## Project layout

```
index.html            entry point — loads src/main.js as a module
src/
  main.js              orchestrator: wires scene, data, UI, interaction together
  data/
    locations.js       the island database — you'll edit this most often
  utils/
    geo.js             lat/lon <-> 3D vector math
  scene/
    setupScene.js      renderer, camera, controls, lights, starfield, globe mesh
    texture.js         procedurally draws the world map texture
    markers.js          dot sprites + always-visible name labels
    landmarks.js        registry of custom 3D landmark models (e.g. Zou's elephant)
  interaction.js        raycasting, hover/click, camera fly-to-location
  ui.js                 side panel, saga filter chips, search, Log Pose needle
  styles/
    main.css
```

## Adding a new island

Open `src/data/locations.js` and append an object to the `LOCATIONS` array:

```js
{
  id: "unique-slug",
  name: "Display Name",
  saga: "Which Saga",
  sea: "East Blue | Paradise | New World | Sky | Undersea | Unknown",
  status: "explored" | "current" | "upcoming",
  lat: -90 to 90,
  lon: 0 to 360,
  summary: "1-2 sentences, written in your own words.",
  events: ["short bullet", "short bullet"],
  characters: [{ name: "...", role: "..." }],
  links: ["id-of-another-location"]   // powers the "follow the story onward" branching
}
```

Positioning cheat sheet:
- `lon` near 180 → the Red Line crossing between the Blues and Paradise (Reverse Mountain side)
- `lon` near 0/360 → the Red Line crossing between Paradise and the New World (Marineford side)
- `lat` near 0 → sits on the Grand Line equatorial band
- `lat` far from 0, `lon` far from 180/0 → one of the four Blues

## Giving an island its own 3D landmark

By default every island is a small dot. To give one an actual model (like
Zou's elephant or Whole Cake Island's tiered cake):

1. Write a builder function in `src/scene/landmarks.js` that returns a
   `THREE.Group` built from primitive geometries.
2. Register it in `LANDMARK_BUILDERS` under a short key.
3. Add `landmark: "yourKey"` to that location's entry in `data/locations.js`.

It will automatically be placed at the right lat/lon and oriented to stand
upright off the curved globe surface.

## Where the source data comes from

- `api.api-onepiece.com` — free public API for sagas, characters, and devil
  fruits (see api-onepiece.com/en/documentation). Note: CORS is disabled on
  this API, so a browser can't call it directly — route it through a small
  backend proxy (e.g. a FastAPI endpoint) if you want to pull live data
  instead of hand-writing entries.
- The One Piece Fandom wiki's MediaWiki API (`onepiece.fandom.com/api.php`)
  for cross-checking facts — pull structured facts only, and write summaries
  in your own words rather than copying wiki prose.

## Extending further (ideas)

- Wire the FastAPI proxy above and swap `data/locations.js` for a fetch call
  on load, with the static array as a fallback.
- Add more landmark builders for Wano (a torii gate), Skypiea (a cloud
  platform), or Fish-Man Island (a glass dome).
- Track devil fruit data per character and surface it in the panel.
- Add a timeline scrubber that highlights every location visited up to a
  given saga, animating the globe through the crew's route in order.
