const { initMediaGalleries } = require("./source/media-gallery");
const { initNavigation } = require("./source/navigation");

(() => {
  initNavigation();
  initMediaGalleries();
})();