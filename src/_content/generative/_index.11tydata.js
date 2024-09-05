module.exports = function () {
  return {
    layout: 'canvas',
    published: false,
    ogType: 'website',
    metaDescription: "Artwork built using p5.js",
    twitterCard: 'summary_large_image',
    eleventyComputed: {
      slug: data => {
        return  data.title.toLowerCase().replaceAll(' ', '-');
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
      ogTitle: data => {
        return data.title;
      }
    }
  }
}