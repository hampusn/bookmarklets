/**
 * Returns true if an element is a bookmarklet link
 * 
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export const isBookmarkElement = (element) => element?.nodeName === 'A' && element.href.startsWith('javascript');

/**
 * Helper for getting the closest HTMLElement which matches the criteria for bookmarklets, 
 * i.e. link elements with a href beginning with "javascript".
 * 
 * This is used for when the event.target matches a child node of the actual link element, such as a nested span or an icon.
 * 
 * @param {HTMLElement} element 
 * @returns {(HTMLElement|null)}
 */
export const getBookmarkElement = (element) => {
  if (isBookmarkElement(element)) {
    return element;
  }

  return element.closest('a[href^="javascript"]');
};
