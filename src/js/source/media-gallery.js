import { Fancybox } from '../vendor/fancybox.min.js';

export const initMediaGalleries = () => {
  const galleries = document.querySelectorAll('.component--media-gallery');

  if (galleries) {
    galleries.forEach(gallery => {
      const singleItem = gallery.querySelector('[data-fancybox]');
      const galleryID = singleItem.getAttribute('data-fancybox');

      Fancybox.bind(`[data-fancybox="${galleryID}"]`, {
        // Your custom options for a specific gallery
      });
    })
  }
}