const DOCUMENT = window.document;

/**
 * @typedef {Object} ToastOptions
 * @property {"success" | "primary" | ""} [type=""] The type of toast to emit.
 * @property {number} [ttl=4] (time to live) in seconds for toast to be shown.
 * @property {Function} [callback] A callback function executed when toast is removed.
 * @property {Boolean} [checkmark=undefined] Boolean value if checkmark should be shown.
 * @property {string} [heading=""] A header string, (not required), will be <strong>.
 * @property {string} message A message string.
 */

/**
 * @param {ToastOptions} options 
 */
export const publish = function publish (options) {
  DOCUMENT.dispatchEvent(new CustomEvent('sv-publish-toast', {
    detail: {
      type: '',
      ...options,
    }
  }));
};

export default { publish };
