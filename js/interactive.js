// interactive.js
// Handles interactions for the Interactive page: site markers, plan display and lightbox for plan markers.

document.addEventListener('DOMContentLoaded', () => {
  const planContainer = document.getElementById('planContainer');
  // Show plan when any site marker is clicked
  document.querySelectorAll('[data-plan-target]').forEach(marker => {
    marker.addEventListener('click', () => {
      if (planContainer.classList.contains('hidden')) {
        planContainer.classList.remove('hidden');
        // On smaller screens, scroll plan into view for better context
        planContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Lightbox logic for plan markers
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('[data-gallery]').forEach(marker => {
    marker.addEventListener('click', () => {
      const galleryId = marker.getAttribute('data-gallery');
      // Build path to placeholder image – expects files in images/ named like gallery1.jpg
      lightboxImage.src = `images/${galleryId}.jpg`;
      lightbox.classList.remove('hidden');
    });
  });
  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightboxImage.src = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
});