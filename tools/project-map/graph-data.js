/* ============================================================
   PROJECT MAP — the codebase's own file/folder/import structure,
   rendered as a graph instead of a folder tree.

   This is the manual equivalent of running a "folder-to-knowledge-graph"
   tool against this repo: every file and folder is a node, "contains"
   edges represent folder structure, and "imports" edges are pulled
   directly from the real `import` statements in the source (verified
   with a grep across the project, not guessed).

   category drives node color in index.html:
     folder   → gold
     entry    → rust        (the HTML entry point)
     core     → rust        (the orchestrator, main.js)
     module   → teal         (logic modules)
     data     → navy         (pure data files, no logic)
     style    → muted teal
     doc      → parchment
     script   → dashed gold  (standalone dev tooling, not loaded by the site)
   ============================================================ */

export const NODES = [
  { id:"root", label:"one-piece-atlas/", category:"folder" },
  { id:"index.html", label:"index.html", category:"entry" },
  { id:"README.md", label:"README.md", category:"doc" },
  { id:"scripts", label:"scripts/", category:"folder" },
  { id:"scripts/fetch-characters.mjs", label:"fetch-characters.mjs", category:"script" },

  { id:"src", label:"src/", category:"folder" },
  { id:"src/main.js", label:"main.js", category:"core" },
  { id:"src/ui.js", label:"ui.js", category:"module" },
  { id:"src/interaction.js", label:"interaction.js", category:"module" },

  { id:"src/data", label:"src/data/", category:"folder" },
  { id:"src/data/locations.js", label:"locations.js", category:"data" },
  { id:"src/data/crews.js", label:"crews.js", category:"data" },

  { id:"src/data/characters", label:"src/data/characters/", category:"folder" },
  { id:"src/data/characters/index.js", label:"index.js", category:"module" },
  { id:"src/data/characters/character-schema.md", label:"character-schema.md", category:"doc" },
  { id:"src/data/characters/strawhats.js", label:"strawhats.js", category:"data" },
  { id:"src/data/characters/admirals-and-marines.js", label:"admirals-and-marines.js", category:"data" },
  { id:"src/data/characters/warlords-and-emperors.js", label:"warlords-and-emperors.js", category:"data" },
  { id:"src/data/characters/worst-generation.js", label:"worst-generation.js", category:"data" },
  { id:"src/data/characters/revolutionaries.js", label:"revolutionaries.js", category:"data" },
  { id:"src/data/characters/giants-and-minks.js", label:"giants-and-minks.js", category:"data" },
  { id:"src/data/characters/supporting-cast.js", label:"supporting-cast.js", category:"data" },
  { id:"src/data/characters/minor-cast-stubs.js", label:"minor-cast-stubs.js", category:"data" },
  { id:"src/data/characters/minor-cast-stubs-2.js", label:"minor-cast-stubs-2.js", category:"data" },
  { id:"src/data/characters/generated-full-roster.js", label:"generated-full-roster.js (built by the script)", category:"data" },

  { id:"src/scene", label:"src/scene/", category:"folder" },
  { id:"src/scene/setupScene.js", label:"setupScene.js", category:"module" },
  { id:"src/scene/texture.js", label:"texture.js", category:"module" },
  { id:"src/scene/markers.js", label:"markers.js", category:"module" },
  { id:"src/scene/landmarks.js", label:"landmarks.js", category:"module" },
  { id:"src/scene/characterGraph.js", label:"characterGraph.js", category:"module" },

  { id:"src/utils", label:"src/utils/", category:"folder" },
  { id:"src/utils/geo.js", label:"geo.js", category:"module" },

  { id:"src/styles", label:"src/styles/", category:"folder" },
  { id:"src/styles/main.css", label:"main.css", category:"style" },
];

export const EDGES = [
  // folder structure
  { source:"root", target:"index.html", type:"contains" },
  { source:"root", target:"README.md", type:"contains" },
  { source:"root", target:"scripts", type:"contains" },
  { source:"root", target:"src", type:"contains" },
  { source:"scripts", target:"scripts/fetch-characters.mjs", type:"contains" },
  { source:"src", target:"src/main.js", type:"contains" },
  { source:"src", target:"src/ui.js", type:"contains" },
  { source:"src", target:"src/interaction.js", type:"contains" },
  { source:"src", target:"src/data", type:"contains" },
  { source:"src", target:"src/scene", type:"contains" },
  { source:"src", target:"src/utils", type:"contains" },
  { source:"src", target:"src/styles", type:"contains" },
  { source:"src/data", target:"src/data/locations.js", type:"contains" },
  { source:"src/data", target:"src/data/crews.js", type:"contains" },
  { source:"src/data", target:"src/data/characters", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/index.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/character-schema.md", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/strawhats.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/admirals-and-marines.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/warlords-and-emperors.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/worst-generation.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/revolutionaries.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/giants-and-minks.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/supporting-cast.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/minor-cast-stubs.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/minor-cast-stubs-2.js", type:"contains" },
  { source:"src/data/characters", target:"src/data/characters/generated-full-roster.js", type:"contains" },
  { source:"src/scene", target:"src/scene/setupScene.js", type:"contains" },
  { source:"src/scene", target:"src/scene/texture.js", type:"contains" },
  { source:"src/scene", target:"src/scene/markers.js", type:"contains" },
  { source:"src/scene", target:"src/scene/landmarks.js", type:"contains" },
  { source:"src/scene", target:"src/scene/characterGraph.js", type:"contains" },
  { source:"src/utils", target:"src/utils/geo.js", type:"contains" },
  { source:"src/styles", target:"src/styles/main.css", type:"contains" },

  // real import relationships, pulled from the actual source
  { source:"index.html", target:"src/main.js", type:"imports" },
  { source:"index.html", target:"src/styles/main.css", type:"imports" },
  { source:"src/main.js", target:"src/data/locations.js", type:"imports" },
  { source:"src/main.js", target:"src/scene/setupScene.js", type:"imports" },
  { source:"src/main.js", target:"src/scene/markers.js", type:"imports" },
  { source:"src/main.js", target:"src/scene/landmarks.js", type:"imports" },
  { source:"src/main.js", target:"src/interaction.js", type:"imports" },
  { source:"src/main.js", target:"src/ui.js", type:"imports" },
  { source:"src/main.js", target:"src/utils/geo.js", type:"imports" },
  { source:"src/main.js", target:"src/scene/texture.js", type:"imports" },
  { source:"src/main.js", target:"src/scene/characterGraph.js", type:"imports" },
  { source:"src/main.js", target:"src/data/characters/index.js", type:"imports" },
  { source:"src/main.js", target:"src/data/crews.js", type:"imports" },
  { source:"src/ui.js", target:"src/data/locations.js", type:"imports" },
  { source:"src/ui.js", target:"src/data/characters/index.js", type:"imports" },
  { source:"src/scene/setupScene.js", target:"src/scene/texture.js", type:"imports" },
  { source:"src/scene/markers.js", target:"src/utils/geo.js", type:"imports" },
  { source:"src/scene/markers.js", target:"src/scene/texture.js", type:"imports" },
  { source:"src/scene/landmarks.js", target:"src/utils/geo.js", type:"imports" },
  { source:"src/scene/characterGraph.js", target:"src/data/characters/index.js", type:"imports" },
  { source:"src/scene/characterGraph.js", target:"src/data/crews.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/strawhats.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/admirals-and-marines.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/warlords-and-emperors.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/worst-generation.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/revolutionaries.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/giants-and-minks.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/supporting-cast.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/minor-cast-stubs.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/minor-cast-stubs-2.js", type:"imports" },
  { source:"src/data/characters/index.js", target:"src/data/characters/generated-full-roster.js", type:"imports-dynamic" },
  { source:"scripts/fetch-characters.mjs", target:"src/data/characters/generated-full-roster.js", type:"writes" },
];
