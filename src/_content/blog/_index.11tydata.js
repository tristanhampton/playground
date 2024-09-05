module.exports = function () {
  return {
    layout: 'blog',
    ogType: 'website',
    tags: 'blog',
    eleventyComputed: {
      slug: data => {
        return  data.title.toLowerCase().replaceAll(' ', '-');
      },
      permalink: data => {
        return `blog/${ data.slug }/`;
      },
      ogTitle: data => {
        return data.title;
      },
      metaDescription: data => {
        return data.summary;
      },
    }
  }
}