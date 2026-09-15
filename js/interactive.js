// interactive.js
// Masterplan hotspots: choosing a marker reveals that zone's floor plan and
// the imagery belonging to it, all of which opens in the shared lightbox.

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.querySelector('[data-plan-panel]');
  if (!panel) return;

  const titleEl  = panel.querySelector('[data-plan-title]');
  const imageEl  = panel.querySelector('[data-plan-image]');
  const thumbsEl = panel.querySelector('[data-plan-thumbs]');
  const hintEl   = document.querySelector('[data-plan-hint]');
  const markers  = Array.from(document.querySelectorAll('[data-plan]'));

  // Assets are named, not pathed: `web` is the in-page render, `large` the
  // full-size view the lightbox opens.
  const web   = (name) => `images/web/${name}.jpg`;
  const large = (name) => `images/large/${name}.jpg`;

  const plans = {
    halls: {
      title: 'Halls',
      plan: 'plan-halls',
      images: ['gallery1', 'gallery2', 'gallery3', 'gallery4']
    },
    'large-company': {
      title: 'Large Company',
      plan: 'plan-large-company',
      images: ['gallery9', 'gallery10', 'gallery11']
    },
    'small-company': {
      title: 'Small Company',
      plan: 'plan-small-company',
      images: ['gallery5', 'gallery6', 'gallery7', 'gallery8', 'gallery13']
    },
    residential: {
      title: 'Residential',
      plan: 'plan-residential',
      images: ['gallery12']
    }
  };

  const buildThumbs = (plan) => {
    // Lightbox items are the floor plan followed by every view of the zone,
    // so the arrow keys walk the whole set.
    const items = [{ type: 'image', src: large(plan.plan), caption: `${plan.title} — plan` }]
      .concat(plan.images.map((name, i) => ({
        type: 'image', src: large(name), caption: `${plan.title} — view ${i + 1}`
      })));

    thumbsEl.innerHTML = '';

    plan.images.forEach((name, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile';
      button.setAttribute('aria-label', `Open ${plan.title} view ${i + 1}`);

      const frame = document.createElement('span');
      frame.className = 'tile-frame';

      const img = document.createElement('img');
      img.src = web(name);
      img.alt = `${plan.title} — view ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      window.auraFadeIn(img);

      const veil = document.createElement('span');
      veil.className = 'tile-veil';

      frame.append(img, veil);
      button.appendChild(frame);
      button.addEventListener('click', () => window.AuraLightbox.open(items, i + 1));
      thumbsEl.appendChild(button);
    });

    return items;
  };

  markers.forEach((marker) => {
    marker.addEventListener('click', () => {
      const plan = plans[marker.dataset.plan];
      if (!plan) return;

      markers.forEach((m) => m.classList.toggle('is-active', m === marker));

      titleEl.textContent = plan.title;
      imageEl.src = web(plan.plan);
      imageEl.alt = `${plan.title} floor plan`;
      window.auraFadeIn(imageEl);

      const items = buildThumbs(plan);
      imageEl.onclick = () => window.AuraLightbox.open(items, 0);
      imageEl.style.cursor = 'zoom-in';

      if (hintEl) hintEl.hidden = true;
      panel.hidden = false;

      // Let the panel paint before animating it in.
      requestAnimationFrame(() => panel.classList.add('is-visible'));
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
