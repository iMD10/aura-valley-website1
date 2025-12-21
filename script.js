/*
 * Global JavaScript for the architecture portfolio.
 *
 * Handles pan/zoom on the plan image, modal gallery interactions, and 360°
 * panorama viewer initialization. Code executes when the DOM is ready to
 * ensure elements are available.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Plan page pan/zoom handling
  const planImage = document.querySelector('#plan-image');
  if (planImage) {
    // Load Panzoom library from CDN if available
    const panzoomScript = document.createElement('script');
    panzoomScript.src = 'https://cdn.jsdelivr.net/npm/@panzoom/panzoom@9.4.0/dist/panzoom.min.js';
    panzoomScript.onload = () => {
      const panzoom = Panzoom(planImage, {
        maxScale: 4,
        minScale: 1,
        contain: 'outside'
      });
      planImage.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
    };
    document.body.appendChild(panzoomScript);
  }

  // Gallery modal handling
  const modal = document.querySelector('.modal');
  if (modal) {
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        modalImg.src = img.src;
        modal.classList.add('open');
      });
    });
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  // VR page initialization
  const viewerContainer = document.getElementById('viewer');
  if (viewerContainer) {
    // Dynamically load dependencies (Three.js and Photo Sphere Viewer)
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
    const psvScript = document.createElement('script');
    psvScript.src = 'https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4.0.7/dist/photo-sphere-viewer.js';
    const psvCss = document.createElement('link');
    psvCss.rel = 'stylesheet';
    psvCss.href = 'https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4.0.7/dist/photo-sphere-viewer.css';
    document.head.appendChild(psvCss);
    threeScript.onload = () => {
      document.body.appendChild(psvScript);
    };
    psvScript.onload = () => {
      // eslint-disable-next-line no-undef
      const viewer = new PhotoSphereViewer.Viewer({
        container: viewerContainer,
        panorama: viewerContainer.dataset.src,
        loadingImg: '',
        defaultZoomLvl: 0,
        autoRotate: false,
        navbar: [
          'zoom', 'move', 'fullscreen'
        ],
      });
    };
    document.body.appendChild(threeScript);
  }
});