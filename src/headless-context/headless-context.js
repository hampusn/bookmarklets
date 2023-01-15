import envisionDialog from './envision-dialog';
import sitevisionApi from './sitevision-api';

((window, document, envision) => {
    const DIALOG_ID = 'headless-context-dialog';
    const { pageId } = window.sv?.PageContext || {};

    // Remove dialog if already in DOM
    const dialog = document.getElementById(DIALOG_ID);
    if (dialog) {
      dialog.parentNode.removeChild(dialog);
    }
  
    // Main code. Fetch from Rest API and output as envision modal dialog.
    const run = async (nodeId) => {
      try {
        const response = await sitevisionApi({ nodeId, apiMethod: 'headless', origin: window.location.origin });
        const debugObj = {
          nodeId,
          status: response.status,
          statusText: response.statusText,
          _response: response
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
        const properties = result?.properties;

        // Empty result. Throw error.
        if (!properties?.['jcr:uuid']) {
          console.error({ result, ...debugObj });
          throw `No results found.`;
        }

        // Build dialog markup.
        const dialogHTML = envisionDialog({
          dialogId: DIALOG_ID,
          title: (properties.articleName || properties.displayName),
          content:`<pre><code>${JSON.stringify(result, null, 2)}</code></pre>`,
          buttons: '<button type="button" data-modal-dialog-dismiss class="env-button">Close</button>',
        });
  
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
  