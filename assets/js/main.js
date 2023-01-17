(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  });

  const BOOKMARKLET_DRAG_ID = 'bookmarklet-drag';
  const BOOKMARKLET_DRAG_CLASS = 'bookmarklet-drag--active';
  const BOOKMARKLET_LINK_CLASS = 'draging';
  const isBookmarkElement = (element) => element?.nodeName === 'A' && element.href.startsWith('javascript');

  window.addEventListener('dragstart', (event) => {
    const { target } = event;

    if (isBookmarkElement(target)) {
      target.classList.add(BOOKMARKLET_LINK_CLASS);
      document.getElementById(BOOKMARKLET_DRAG_ID).classList.add(BOOKMARKLET_DRAG_CLASS);
    }
  });

  window.addEventListener('dragend', (event) => {
    const { target } = event;

    if (isBookmarkElement(target)) {
      target.classList.remove(BOOKMARKLET_LINK_CLASS);
      document.getElementById(BOOKMARKLET_DRAG_ID).classList.remove(BOOKMARKLET_DRAG_CLASS);
    }
  });

})();
