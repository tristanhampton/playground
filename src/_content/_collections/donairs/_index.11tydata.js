export default {
  layout: 'default',
  permalink: false,
  eleventyComputed: {
    donairs: data => {
      let symbol = '🌯';
      let rating = data.rating;
      let donairRating = '';

      if (rating == 0) {
        return 'no 🌯\'s awarded';
      }

      for (let i = 1; i <= rating; i++) {
        donairRating += symbol;
      }

      return donairRating;
    },
    halfRating: data => {
      return data.rating % 1 !== 0;
    }
  }
}