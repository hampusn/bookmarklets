const ACTIVE_CLASS = 'is-active';
const MENU_TOGGLER_SELECTOR = '.navbar-burger';

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger"/toggler elements
  const togglerList = document.querySelectorAll(MENU_TOGGLER_SELECTOR);

  // Add a click event on each of them
  togglerList.forEach((toggler) => {
    toggler.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = document.getElementById(toggler.dataset.target);

      if (target) {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        toggler.classList.toggle(ACTIVE_CLASS);
        target.classList.toggle(ACTIVE_CLASS);
      }
    });
  });
});
