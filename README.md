# Playground

My personal site, built with [Astro](https://astro.build).

Node 22.22+ is required (see `.nvmrc`). Run `nvm use` first, then:

- `npm run dev` — dev server on localhost with HMR
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the built `dist/` locally
- `npm run check` — typecheck templates and content schemas

## Creative coding

The p5.js sketches under `/creative/generative/` are the one part of this site
that is deliberately *not* run through the bundler.

- Sketch source lives in `public/js/generative/<slug>.js` and is served
  verbatim. Each sketch is a classic (non-module) script using p5's global
  mode, so `setup()`/`draw()` and the p5 globals have to stay on `window`.
- The vendored libraries (p5, p5.sound, tweakpane, matter, …) live in
  `public/js/plugins/` and are likewise untouched.
- `src/layouts/Canvas.astro` emits all of these with `is:inline`, in order:
  libraries first, then the sketch. It also provides the two DOM hooks the
  sketches rely on — `#canvasContainer` and `.project__tweak-settings` — and
  keeps them *before* the script tags, because several sketches build their
  Tweakpane at module top level.

To add a sketch:

1. Drop the script at `public/js/generative/<slug>.js`.
2. Add `src/content/generative/<slug>.md` with a `title`, `date`, the
   `libraries` it needs, and a `thumbnail` beside it. The filename is the slug
   and the URL segment, and it must match the script's filename.
3. Set `published: true` to list it on `/creative/generative/`. Entries build
   at their URL either way; unpublished ones are just unlisted.

Sketches tagged `study` additionally appear in a "Studies" section that only
renders during `npm run dev`.

## Content

`src/content/` holds every collection, typed in `src/content.config.ts`:

- `generative` — the p5 sketches described above
- `posts` — long-form writing, served at `/notes/long-form/<slug>/`
- `bookmarks` — paginated 10 per page at `/bookmarks/`, then `/bookmarks/page-N/`
- `projects`, `tools`, `fakestagram` (the `/pictures/` grid), `donairs`, `wishlist`
- `goodreads`, `letterboxd`, `steam`, `strava`, `music` — synced, see Echo below

Images referenced by a collection entry sit next to it and go through Astro's
image pipeline (`src/components/SquarePicture.astro` emits the two-breakpoint
AVIF `<picture>` the old sharp-images plugin produced). Anything referenced by
a literal URL instead lives in `public/`.

## Echo

The `/me` page data is scraped from Steam, Letterboxd, Goodreads and Strava by
a modified version of Robb Knight's "Echo", which runs on my home server and
commits into `src/content/`. See the [Echo repo](https://github.com/tristanhampton/echo).

## Github Actions

`.github/workflows/sync.yml` syncs some content directories to my 2024
portfolio so content can be edited in one place. This needs a Personal Access
Token, replaceable at `Settings > Secrets and Variables > Actions`.
