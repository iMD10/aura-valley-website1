// main.js
// Handles reusable behaviours across pages, such as mobile navigation.

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggling
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});