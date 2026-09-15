// gallery.js
// Wires the gallery tiles to the shared lightbox. Every tile carries its own
// source on a data attribute, so the viewer can step through the whole set.

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-gallery]');
  if (!grid) return;

  const tiles = Array.from(grid.querySelectorAll('[data-item]'));

  const items = tiles.map((tile) => ({
    type: tile.dataset.type,
    src: tile.dataset.src,
    caption: tile.dataset.caption
  }));

  tiles.forEach((tile, i) => {
    tile.addEventListener('click', () => window.AuraLightbox.open(items, i));
  });
});
