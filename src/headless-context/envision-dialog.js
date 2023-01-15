/**
 * Creates the HTML markup for an envision dialog.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.dialogId A unique html ID for the dialog.
 * @param {string} options.title The title of the dialog.
 * @param {string} options.content The content of the dialog. Placed in the dialog body.
 * @param {string} [options.size='large'] Available sizes: 'large', 'small'
 * @param {string} [options.buttons=''] Buttons markup to be placed in the dialog footer.
 * @returns {string}
 */
export default function envisionDialog ({ dialogId, title, content, size = 'large', buttons = '' }) {
  const classBase = 'env-modal-dialog';
  const footer = !buttons ? '' : `<footer class="${classBase}__footer ${classBase}__footer--right">${buttons}</footer>`;

  return (
  `<div id="${dialogId}" class="${classBase} ${classBase}--inner-scroll" role="dialog" aria-modal="true" aria-labelledby="${dialogId}-heading" aria-hidden="true" tabindex="-1">
    <div class="${classBase}__dialog ${classBase}__dialog--${size}">
      <section class="${classBase}__content">
        <header class="${classBase}__header">
          <h5 class="env-text ${classBase}__header__title" id="${dialogId}-heading">${title}</h5>
        </header>
        <div class="${classBase}__body">${content}</div>
        ${footer}
      </section>
    </div>
  </div>`
  );
}
