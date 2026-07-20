import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projectMap: resolve(__dirname, 'tools/project-map/index.html'),
        storyGraph: resolve(__dirname, 'tools/story-graph/index.html'),
        timeTravel: resolve(__dirname, 'tools/time-travel/index.html'),
        bountyChart: resolve(__dirname, 'tools/bounty-chart/index.html'),
        routeAnimation: resolve(__dirname, 'tools/route-animation/index.html'),
        qa: resolve(__dirname, 'tools/qa/index.html'),
        bounties: resolve(__dirname, 'tools/bounties/index.html'),
        devilFruits: resolve(__dirname, 'tools/devil-fruits/index.html'),
        origins: resolve(__dirname, 'tools/origins/index.html'),
        familyTree: resolve(__dirname, 'tools/family-tree/index.html'),
        flatMap: resolve(__dirname, 'tools/flat-map/index.html'),
        muralTheories: resolve(__dirname, 'tools/mural-theories/index.html'),
      },
    },
  },
});
