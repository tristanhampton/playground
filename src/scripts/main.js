import { initNavigation } from "./source/navigation.js";
import { initMediaGalleries } from "./source/media-gallery.js";
import { initGoogleFontSwitcher } from "./source/google-font-switcher.js";

(() => {
  initNavigation();
  initMediaGalleries();

  if (window.location.pathname === "/kitchen-sink/") {
    initGoogleFontSwitcher();
  }
})();