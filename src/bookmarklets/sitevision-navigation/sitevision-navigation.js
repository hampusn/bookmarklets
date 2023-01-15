((window, document, envision) => {
  const DIALOG_ID = 'sitevision-navigation-dialog';
  const CLASS_BASE = 'env-modal-dialog';
  const TYPE_PAGE = 'sv:page';
  const TYPE_FOLDER = 'sv:folder';

  const { origin } = window.location;
  const { pageId } = window.sv?.PageContext || {};
  const apiParams = encodeURIComponent(JSON.stringify({
    includes: [ TYPE_PAGE, TYPE_FOLDER ],
    properties: [ "URI" ]
  }));
  const fetchOpts = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  // Remove dialog if already in DOM
  const dialog = document.getElementById(DIALOG_ID);
  if (dialog) {
    dialog.parentNode.removeChild(dialog);
  }

  // Main code. Fetch from Rest API and output as envision modal dialog.
  const run = async (nodeId) => {
    try {
      const url = `${origin}/rest-api/1/1/${nodeId}/nodes?format=json&json=${apiParams}`;
      const response = await fetch(url, fetchOpts);
      const debugObj = {
        nodeId,
        status: response.status,
        statusText: response.statusText,
        url, _response: response
      };

      // Someting went wrong. Throw error.
      if (!response.ok) {
        console.error(debugObj);
        if (response.status === 401) {
          throw `Missing authentication. Are you logged in?`;
        }
        throw `Something went wrong. Status ${response.status}`;
      }

      const result = await response.json();

      // Empty result. Throw error.
      if (!Array.isArray(result) || result.length === 0) {
        console.error({ result, ...debugObj });
        throw `No results found.`;
      }

      // No pages in result means we only got folder(s). Use first folder and rerun.
      if (result.filter(({ type }) => type === TYPE_PAGE).length === 0) {
        run(result[0].id);
        return;
      }

      // Build dialog markup.
      const dialogHTML =
      `<div id="${DIALOG_ID}" class="${CLASS_BASE} ${CLASS_BASE}--inner-scroll" role="dialog" aria-modal="true" aria-labelledby="${DIALOG_ID}-heading" aria-hidden="true" tabindex="-1">
        <div class="${CLASS_BASE}__dialog">
          <section class="${CLASS_BASE}__content">
            <header class="${CLASS_BASE}__header">
              <h5 class="env-text ${CLASS_BASE}__header__title" id="${DIALOG_ID}-heading">Sub pages</h5>
            </header>
            <div class="${CLASS_BASE}__body">            
              <ul class="env-list">
                ${result.filter(({ type }) => type === TYPE_PAGE).map(item =>
                  `<li class="env-list__item"><a class="env-button env-button--link" href="${item.properties.URI}">${item.name}</a></li>`
                ).join('')}
              </ul>
            </div>
            <footer class="${CLASS_BASE}__footer ${CLASS_BASE}__footer--right">
              <button type="button" data-modal-dialog-dismiss class="env-button">Close</button>
            </footer>
          </section>
        </div>
      </div>`;

      // Insert dialog into end of body and show dialog with envision.
      document.body.insertAdjacentHTML('beforeend', dialogHTML);
      envision.dialog('#' + DIALOG_ID).then(function (dialogs) {
        dialogs[0].show();
      });
    } catch (e) {
      // Log and show a toast message with error.
      console.error(e);
      document.dispatchEvent(new CustomEvent('sv-publish-toast', {
        detail: {
          heading: 'Error!',
          message: String(e),
        }
      }));
    }
  }

  // Run logic.
  run(pageId);
})(window, document, envision)
