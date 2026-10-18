// @ts-check
import { defineConfig } from 'astro/config';
import scssGlobImport from './vite-scss-glob.mjs';

export default defineConfig({
  site: 'https://tristanhampton.ca',

  // Match the old 11ty output: every page is a directory with an index.html
  build: {
    format: 'directory',
  },

  image: {
    // The generative thumbnails, project screenshots, bookbinding photos and
    // picture posts are all resized to AVIF, the same as the old
    // eleventy-plugin-sharp-images pipeline did.
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  vite: {
    plugins: [scssGlobImport()],
    css: {
      preprocessorOptions: {
        scss: {
          // style.scss relies on a single flat @import scope so that
          // global/_design-system.scss variables are visible to every partial.
          // Keep that, and quiet the Dart Sass deprecation notices it triggers.
          silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
        },
      },
    },
  },
});
