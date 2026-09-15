// lightbox.js
// A single lightbox shared by the gallery and the interactive plan viewer.
// The markup is created on first use, so pages only have to hand it a list of
// items: { type: 'image' | 'video', src, caption }.

window.AuraLightbox = (() => {
  'use strict';

  let root, stage, imageEl, videoEl, counterEl, prevBtn, nextBtn, closeBtn;
  let items = [];
  let index = 0;
  let lastFocused = null;

  const ICONS = {
    close: 'M6 18 18 6M6 6l12 12',
    prev:  'M15 19.5 7.5 12 15 4.5',
    next:  'M9 4.5 16.5 12 9 19.5'
  };

  const icon = (path) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
          stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
       <path d="${path}" />
     </svg>`;

  function mount() {
    if (root) return;

    root = document.createElement('div');
    root.className = 'lightbox';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Media viewer');
    root.innerHTML = `
      <div class="lightbox-stage" data-stage>
        <button class="lb-btn lb-close" type="button" aria-label="Close">${icon(ICONS.close)}</button>
        <button class="lb-btn lb-prev" type="button" aria-label="Previous">${icon(ICONS.prev)}</button>
        <button class="lb-btn lb-next" type="button" aria-label="Next">${icon(ICONS.next)}</button>
        <img data-lb-image alt="" hidden />
        <video data-lb-video controls playsinline hidden></video>
        <p class="lb-counter" data-lb-counter></p>
      </div>`;

    document.body.appendChild(root);

    stage     = root.querySelector('[data-stage]');
    imageEl   = root.querySelector('[data-lb-image]');
    videoEl   = root.querySelector('[data-lb-video]');
    counterEl = root.querySelector('[data-lb-counter]');
    closeBtn  = root.querySelector('.lb-close');
    prevBtn   = root.querySelector('.lb-prev');
    nextBtn   = root.querySelector('.lb-next');

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));

    // Clicking the backdrop (but not the media itself) dismisses the viewer.
    root.addEventListener('click', (e) => {
      if (e.target === root || e.target === stage) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape')     { close(); }
      if (e.key === 'ArrowLeft')  { step(-1); }
      if (e.key === 'ArrowRight') { step(1); }
    });
  }

  const isOpen = () => root && root.classList.contains('is-open');

  function render() {
    const item = items[index];
    if (!item) return;

    videoEl.pause();

    if (item.type === 'video') {
      imageEl.hidden = true;
      imageEl.removeAttribute('src');
      videoEl.hidden = false;
      videoEl.src = item.src;
      videoEl.play().catch(() => {});
    } else {
      videoEl.hidden = true;
      videoEl.removeAttribute('src');
      imageEl.hidden = false;
      imageEl.src = item.src;
      imageEl.alt = item.caption || 'Project image';
    }

    const many = items.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
    counterEl.textContent = many ? `${index + 1} / ${items.length}` : '';
  }

  function step(delta) {
    if (items.length < 2) return;
    index = (index + delta + items.length) % items.length;
    render();
  }

  function open(list, startIndex = 0) {
    mount();
    items = Array.isArray(list) ? list : [list];
    index = Math.max(0, Math.min(startIndex, items.length - 1));
    lastFocused = document.activeElement;

    render();
    root.classList.add('is-open');
    document.body.classList.add('is-locked');
    closeBtn.focus();
  }

  function close() {
    if (!isOpen()) return;

    root.classList.remove('is-open');
    document.body.classList.remove('is-locked');

    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
    imageEl.removeAttribute('src');

    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  return { open, close };
})();
