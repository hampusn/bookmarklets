import confetti from 'canvas-confetti';
import { getBookmarkElement, isBookmarkElement } from './utils';

const CONFETTI_BOOKMARK_SHAPE = confetti.shapeFromPath({
  path: 'M17.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984l-6.984-3-6.984 3v-15.984q0-0.797 0.586-1.406t1.383-0.609h10.031z'
});
const CONFETTI_COLORS = [ '#001427', '#708D81', '#F4D58D', '#BF0603', '#8D0801', '#FCFAF9', '#364156', '#CDCDCD' ]; // TODO: Read these from _variables.scss
const BOOKMARKLET_DRAG_ID = 'bookmarklet-drag';
const BOOKMARKLET_DRAG_CLASS = 'bookmarklet-drag--active';
const BOOKMARKLET_BUTTON_DRAGING_CLASS = 'bookmarklet-button--draging';
const BOOKMARKLET_BUTTON_ERROR_CLASS = 'bookmarklet-button--error';
const BOOKMARKLET_BUTTON_SUCCESS_CLASS = 'bookmarklet-button--success';

window.addEventListener('click', (event) => {
  const { target } = event;
  const bookmark = getBookmarkElement(target);

  if (bookmark) {
    bookmark.classList.remove(BOOKMARKLET_BUTTON_ERROR_CLASS);
    void bookmark.offsetWidth;
    bookmark.classList.add(BOOKMARKLET_BUTTON_ERROR_CLASS);

    event.preventDefault();
  }
});

window.addEventListener('animationend', (event) => {
  const { target } = event;
  
  if (isBookmarkElement(target)) {
    target.classList.remove(
      BOOKMARKLET_BUTTON_ERROR_CLASS,
      BOOKMARKLET_BUTTON_SUCCESS_CLASS
    );
  }
});

window.addEventListener('dragstart', (event) => {
  const { target } = event;

  if (isBookmarkElement(target)) {
    target.classList.add(BOOKMARKLET_BUTTON_DRAGING_CLASS);
    document.getElementById(BOOKMARKLET_DRAG_ID).classList.add(BOOKMARKLET_DRAG_CLASS);
  }
});

window.addEventListener('dragend', (event) => {
  const { target, dataTransfer } = event;

  if (dataTransfer.dropEffect === 'copy') {
    target.classList.add(BOOKMARKLET_BUTTON_SUCCESS_CLASS);

    confetti({
      shapes: [CONFETTI_BOOKMARK_SHAPE],
      disableForReducedMotion: true,
      particleCount: 150,
      spread: 120,
      colors: CONFETTI_COLORS,
    });
  }

  if (isBookmarkElement(target)) {
    target.classList.remove(BOOKMARKLET_BUTTON_DRAGING_CLASS);
    document.getElementById(BOOKMARKLET_DRAG_ID).classList.remove(BOOKMARKLET_DRAG_CLASS);
  }
});
