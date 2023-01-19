import envisionDialog from './envision-dialog';
import sitevisionApi from './sitevision-api';

((window, document) => {
    const { pageId } = window.sv?.PageContext || {};
    const modalDialog = envisionDialog({
      dialogId: 'sitevision-inspector-dialog',
      views: [
        {
          text: 'Properties',
          callback () {

          }
        },
        {
          text: 'Nodes',
          callback () {

          }
        },
        {
          text: 'Headless',
          callback () {

          }
        },
      ],
    });

    modalDialog.show();

    // Main code. Fetch from Rest API and output as envision modal dialog.
    /*
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
    */
  })(window, document)
  