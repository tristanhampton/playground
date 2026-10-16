import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const md = (base: string) => glob({ pattern: '**/*.md', base: `./src/content/${base}` });

/**
 * Goodreads writes a handful of dates with an unpadded month ("2023-2-20"),
 * which `new Date()` rejects outright. Pad them before coercing.
 */
const looseDate = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  return value.replace(
    /^(\d{4})-(\d{1,2})-(\d{1,2})/,
    (_m, y, mo, d) => `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
  );
}, z.coerce.date());

/* Creative coding
 * -----------------------------------------------
 * One entry per p5.js sketch. The entry id is the slug, which is also the
 * filename of the sketch in public/js/generative/ and the page's URL segment.
 */
const generative = defineCollection({
  loader: md('generative'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: looseDate,
      tags: z.array(z.string()).default([]),
      // Loaded in order as classic scripts, before the sketch itself.
      libraries: z.array(z.string()).default([]),
      // Carried over from 11ty: sketches are unlisted until opted in.
      published: z.boolean().default(false),
      intro: z.string().optional(),
      thumbnail: image().optional(),
      ogDescription: z.string().nullish(),
    }),
});

/* Writing
 * ----------------------------------------------- */
const posts = defineCollection({
  loader: md('posts'),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    date: looseDate.optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    type: z.string().optional(),
    published: z.boolean().default(true),
    draft: z.boolean().default(false),
    // Two posts keep their body in a `post` frontmatter key rather than the body.
    post: z.string().optional(),
  }),
});

const bookmarks = defineCollection({
  loader: md('bookmarks'),
  schema: z.object({
    title: z.string(),
    link: z.string(),
    date: looseDate,
    type: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
});

/* Web work
 * ----------------------------------------------- */
const projects = defineCollection({
  loader: md('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      short: z.string().optional(),
      date: looseDate,
      tags: z.array(z.string()).default([]),
      redirect: z.boolean().default(false),
      website_url: z.string().optional(),
      published: z.boolean().default(true),
      screenshot: image().optional(),
    }),
});

const tools = defineCollection({
  loader: md('tools'),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    date: looseDate,
    styles: z.array(z.string()).default([]),
    scripts: z.array(z.string()).default([]),
  }),
});

/* Pictures
 * ----------------------------------------------- */
const fakestagram = defineCollection({
  loader: md('fakestagram'),
  schema: z.object({
    title: z.string(),
    photo: z.string(),
    alt: z.string().default(''),
    date: looseDate,
    published: z.boolean().default(true),
    caption: z.string().optional(),
  }),
});

/* Synced from elsewhere (Echo: Steam, Letterboxd, Goodreads, Strava)
 * ----------------------------------------------- */
const goodreads = defineCollection({
  loader: md('goodreads'),
  schema: z.object({
    title: z.string(),
    date: looseDate,
    cover: z.string(),
    author: z.string().optional(),
    category: z.string().optional(),
    id: z.string().optional(),
    contentSnippet: z.string().optional(),
    link: z.string().optional(),
  }),
});

const letterboxd = defineCollection({
  loader: md('letterboxd'),
  schema: z.object({
    title: z.string(),
    poster: z.string().nullish(),
    review: z.string().optional(),
    date: looseDate,
    id: z.string().optional(),
    link: z.string().optional(),
  }),
});

const steam = defineCollection({
  loader: md('steam'),
  schema: z.object({
    title: z.string(),
    id: z.union([z.string(), z.number()]).transform(String),
    date: looseDate,
    link: z.string().optional(),
    image: z.string().optional(),
    playtime_2weeks: z.number().default(0),
    playtime_forever: z.number().default(0),
    playtime_windows_forever: z.number().default(0),
    playtime_mac_forever: z.number().default(0),
    playtime_linux_forever: z.number().default(0),
    playtime_deck_forever: z.number().default(0),
  }),
});

const strava = defineCollection({
  loader: md('strava'),
  schema: z.object({
    title: z.string(),
    date: looseDate,
    type: z.string().nullish(),
    distance: z.string().optional(),
    elevation: z.string().optional(),
    time: z.string().optional(),
    speed: z.string().optional(),
    id: z.string().optional(),
    link: z.string().optional(),
    rideDate: z.string().optional(),
    pubDate: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

const music = defineCollection({
  loader: md('music'),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    cover: z.string(),
    date: looseDate,
  }),
});

/* Odds and ends
 * ----------------------------------------------- */
const donairs = defineCollection({
  loader: md('donairs'),
  schema: z.object({
    title: z.string(),
    restaurant: z.string().optional(),
    location: z.string().optional(),
    rating: z.number().default(0),
    like: z.string().optional(),
    dislike: z.string().optional(),
  }),
});

const wishlist = defineCollection({
  loader: md('wishlist'),
  schema: z.object({
    title: z.string(),
    link: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  generative,
  posts,
  bookmarks,
  projects,
  tools,
  fakestagram,
  goodreads,
  letterboxd,
  steam,
  strava,
  music,
  donairs,
  wishlist,
};
