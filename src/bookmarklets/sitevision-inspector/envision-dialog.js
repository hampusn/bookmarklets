/**
 * Creates the HTML markup for an envision dialog.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.dialogId A unique html ID for the dialog.
 * @param {string} [options.views=[]]
 * @returns {string}
 */
export default function envisionDialog ({ dialogId, views = [] }) {
  const document = window.document;
  const envision = window.envision;
  const classBase = 'env-modal-dialog';
  const titleId = dialogId + '-t';
  const contentId = dialogId + '-c';
  const buttonIdBase = dialogId + '-b';

  if (!document.getElementById(dialogId)) {
    // Insert dialog into end of body and show dialog with envision.
    document.body.insertAdjacentHTML('beforeend', (
    `<div id="${dialogId}" class="${classBase} ${classBase}--inner-scroll" style="z-index:99999" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-hidden="true" tabindex="-1">
      <div class="${classBase}__dialog ${classBase}__dialog--large">
        <section class="${classBase}__content">
          <header class="${classBase}__header">
            <h5 id="${titleId}" class="env-text ${classBase}__header__title">Sitevision inspector</h5>
          </header>
          <div class="${classBase}__body">
            <div class="env-button-group" role="group">
              ${views.map((view, i) => `<button id="${buttonIdBase + i}" type="button" class="env-button">${view.text}</button>`).join('')}
            </div>
            <div id="${contentId}"></div>
          </div>
          <footer class="${classBase}__footer ${classBase}__footer--right"><button type="button" data-modal-dialog-dismiss class="env-button">Close</button></footer>
        </section>
      </div>
    </div>`
    ));
  }

  const dialogEl = document.getElementById(dialogId);
  const titleEl = document.getElementById(titleId);
  const contentEl = document.getElementById(contentId);

  /* const dialogHTML = envisionDialog({
    dialogId: DIALOG_ID,
    title: (properties.articleName || properties.displayName),
    content:`<pre><code>${JSON.stringify(result, null, 2)}</code></pre>`,
    buttons: '<button type="button" data-modal-dialog-dismiss class="env-button">Close</button>',
  }); */

  return {
    show (cb) {
      envision.dialog('#' + dialogId, 'show').then(cb);
    },
    hide (cb) {
      envision.dialog('#' + dialogId, 'hide').then(cb);
    },
    setTitle (t) {
      titleEl.innerHTML = t;
    },
    setContent (c) {
      contentEl.innerHTML = c;
    }
  };
}
