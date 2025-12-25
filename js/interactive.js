document.addEventListener('DOMContentLoaded', () => {
  const planContainer = document.getElementById('planContainer');
  const planTitle = document.getElementById('planTitle');
  const planImage = document.getElementById('planImage');
  const planGallery = document.getElementById('planGallery');

  // Define plans and their images
  const plans = {
    halls: {
      title: 'Halls',
      planImage: 'images/plan-halls.jpg',
      images: [
        'images/gallery1.jpg',
        'images/gallery2.jpg',
        'images/gallery3.jpg',
        'images/gallery4.jpg',
        
      ]
    },
    'large-company': {
      title: 'Large Company',
      planImage: 'images/plan-large-company.jpg',
      images: [
        'images/gallery9.jpg',
        'images/gallery10.jpg',
        'images/gallery11.jpg',
      ]
    },
    'small-company': {
      title: 'Small Company',
      planImage: 'images/plan-small-company.jpg',
      images: [
        'images/gallery5.jpg',
        'images/gallery6.jpg',
        'images/gallery7.jpg',
        'images/gallery8.jpg',
        'images/gallery13.jpg',

      ]
    },
    residential: {
      title: 'Residential',
      planImage: 'images/plan-residential.jpg',
      images: [
        'images/gallery12.jpg',
      ]
    }
  };

  document.querySelectorAll('[data-plan]').forEach(marker => {
    marker.addEventListener('click', () => {
      const key = marker.dataset.plan;
      const plan = plans[key];

      if (!plan) return;

      // Show container
      planContainer.classList.remove('hidden');

      // Update title and plan
      planTitle.textContent = plan.title;
      planImage.src = plan.planImage;

      // Build gallery
      planGallery.innerHTML = '';
      plan.images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className =
          'w-full h-auto rounded-md shadow-sm object-cover cursor-pointer';
        img.addEventListener('click', () => {
          openLightbox(src);
        });
        planGallery.appendChild(img);
      });

      // Scroll into view on small screens
      planContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Lightbox reuse
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  window.openLightbox = (src) => {
    lightboxImage.src = src;
    lightbox.classList.remove('hidden');
  };

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightboxImage.src = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      lightboxImage.src = '';
    }
  });
});
