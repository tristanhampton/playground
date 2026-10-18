import fs from 'node:fs';
import path from 'node:path';

// Matches a single-directory glob import, e.g. @import "components/*";
// Deliberately distinct from a normal `@import "components/cards";` so both
// forms can coexist in the same file.
const GLOB_IMPORT = /^@import\s+["']([^"']+)\/\*["'];?[ \t]*$/gm;

const STYLE_EXTENSIONS = new Set(['.scss', '.sass', '.css']);

/**
 * Expands `@import "<dir>/*";` into one `@import` per file in that
 * directory, sorted alphabetically -- so dropping a new partial into
 * global/, layouts/, or components/ picks it up with no edit to style.scss.
 *
 * `reset` is special-cased to sort first within whichever directory holds
 * it: resets are conventionally expected to load before anything that
 * might reasonably override them, and nothing else in this codebase
 * currently depends on a specific order (verified: no two files in the
 * same directory declare the same top-level selector, except reset vs.
 * layout/typography on html/body/picture -- and even those don't share a
 * single property today, but keeping reset first costs nothing and avoids
 * relying on that staying true).
 */
function expandGlob(code, fromFile) {
  const baseDir = path.dirname(fromFile);

  return code.replace(GLOB_IMPORT, (_match, dir) => {
    const absDir = path.resolve(baseDir, dir);
    const entries = fs.readdirSync(absDir, { withFileTypes: true });

    const names = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => STYLE_EXTENSIONS.has(path.extname(name)))
      .map((name) => {
        const withoutExt = name.replace(/\.(scss|sass|css)$/, '');
        return withoutExt.startsWith('_') ? withoutExt.slice(1) : withoutExt;
      })
      .sort((a, b) => {
        if (a === 'reset') return -1;
        if (b === 'reset') return 1;
        return a.localeCompare(b);
      });

    if (names.length === 0) {
      throw new Error(`[scss-glob-import] "${dir}/*" matched no stylesheets (resolved to ${absDir})`);
    }

    return names.map((name) => `@import "${dir}/${name}";`).join('\n');
  });
}

/** Vite plugin: expands directory-glob @import lines before Sass compiles them. */
export default function scssGlobImport() {
  return {
    name: 'scss-glob-import',
    enforce: 'pre',
    transform(code, id) {
      const [filePath] = id.split('?');
      if (!STYLE_EXTENSIONS.has(path.extname(filePath))) return;
      if (!GLOB_IMPORT.test(code)) return;
      GLOB_IMPORT.lastIndex = 0; // .test() above advanced the shared regex state

      return { code: expandGlob(code, filePath), map: null };
    },
  };
}
