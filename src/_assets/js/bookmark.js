
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
