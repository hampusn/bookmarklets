/**
 * Creates the HTML markup for an envision dialog.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.dialogId A unique html ID for the dialog.
 * @param {string} [options.views=[]]
 * @returns {string}
 */
export default function dialog ({ dialogId, views = [] }) {
  const document = window.document;
  const envision = window.envision;
  const classBase = 'env-modal-dialog';
  const titleId = dialogId + '-t';
  const contentId = dialogId + '-c';
  const buttonIdBase = dialogId + '-b';
  const activeClass = 'env-button--primary';

  if (!document.getElementById(dialogId)) {
    // Insert dialog into end of body and show dialog with envision.
    document.body.insertAdjacentHTML('beforeend', (
    `<div id="${dialogId}" class="${classBase} ${classBase}--inner-scroll" style="z-index:99999" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-hidden="true" tabindex="-1">
      <div class="${classBase}__dialog ${classBase}__dialog--large">
        <section class="${classBase}__content">
          <header class="${classBase}__header">
            <h5 id="${titleId}" class="env-text ${classBase}__header__title">Sitevision inspector</h5>
            <div class="env-button-group env-m-top--small">
              ${views.map((view, i) => `<button id="${buttonIdBase + i}" type="button" class="env-button env-flex__item--grow-1">${view.text}</button>`).join('')}
            </div>
          </header>
          <div class="${classBase}__body">
            <div id="${contentId}">View properties, nodes and headless data with the buttons above.</div>
          </div>
          <footer class="${classBase}__footer ${classBase}__footer--right"><button type="button" data-modal-dialog-dismiss class="env-button">Close</button></footer>
        </section>
      </div>
    </div>`
    ));

    const buttonCallback = async (view, button) => {
      try {
        const { html } = await view.callback.call(null);

        document.getElementById(contentId).innerHTML = html;
        document.getElementById(dialogId).querySelectorAll('.env-button-group > .env-button').forEach((btn) => {
          btn.classList.remove(activeClass);
        });
        button.classList.add(activeClass);
      } catch (e) {
        console.error(e);
        document.dispatchEvent(new CustomEvent('sv-publish-toast', {
          detail: {
            heading: 'Error!',
            message: String(e),
          }
        }));
      }
    };

    views.forEach((view, i) => {
      const button = document.getElementById(buttonIdBase + i);
      button.addEventListener('click', buttonCallback.bind(null, view, button))
    });
  }

  return {
    show (cb) {
      envision.dialog('#' + dialogId, 'show').then(cb);
    },
    hide (cb) {
      envision.dialog('#' + dialogId, 'hide').then(cb);
    },
    toggle (cb) {
      envision.dialog('#' + dialogId, 'toggle').then(cb);
    },
  };
}
