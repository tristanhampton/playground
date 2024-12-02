export default {
  layout: 'canvas',
  published: false,
  ogType: 'website',
  meta_description: "Artwork built using p5.js",
  twitterCard: 'summary_large_image',
  backLink: '/generative',
  permalink: function ({ title }) {
    return `/generative/${this.slugify(title)}/`;
  },
  eleventyComputed: {
    slug: data => {
      return data.title.toLowerCase().replaceAll(' ', '-');
    },
    thumbnail: data => {
      return `${data.slug}.png`;
    },
    js_file: data => {
      return data.slug;
    },
    eleventyNavigation: {
      key: data => data.title,
      parent: 'generative',
    },
    ogImage: data => {
      return `/generative/img/${data.slug}.png`;
    },
    og_title: data => {
      return data.title;
    },
  }
}