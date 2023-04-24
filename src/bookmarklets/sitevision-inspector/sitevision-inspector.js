import dialog from './dialog';
import sitevisionApi from './sitevision-api';

const TYPE_PAGE = 'sv:page';
const TYPE_FOLDER = 'sv:folder';

((window, document) => {
    const { pageId: nodeId } = window.sv?.PageContext || {};
    const modalDialog = dialog({
      dialogId: 'sitevision-inspector-dialog',
      views: [
        {
          text: 'Properties',
          async callback () {
            const response = await sitevisionApi({ nodeId, apiMethod: 'properties' });
            const data = await response.json();

            const html = (
              `<table class="env-table env-table--zebra env-table--small">
                <caption class="env-assistive-text">Properties for ${data.articleName || data.displayName}</caption>
                <thead>
                  <tr><th>Property</th><th>Value</th></tr>
                </thead>
                <tbody>
                  ${Object.entries(data).map(([ key, value ]) =>
                    `<tr><td style="white-space:nowrap">${key}</td><td>${value}</td></tr>`
                    ).join('')}
                </tbody>
              </table>`
            );

            return { html };
          }
        },
        {
          text: 'Nodes',
          async callback () {
            const options = {
              includes: [ TYPE_PAGE, TYPE_FOLDER ],
              properties: [ "URI" ]
            };
            const response = await sitevisionApi({ nodeId, apiMethod: 'nodes', options });
            const data = await response.json();

            const html = (
              `<ul class="env-nav env-nav--sidenav">
                ${data.map(item =>
                  `<li class="env-nav__item">
                    ${item.type === TYPE_PAGE ?
                      `<a class="env-nav__link" href="${item.properties.URI}">${item.name}</a>`
                    :
                      `<span class="env-nav__link">${item.name}</span>`
                    }
                  </li>`
                ).join('')}
              </ul>`
            );

            return { html };
          }
        },
        {
          text: 'Headless',
          async callback () {
            const response = await sitevisionApi({ nodeId, apiMethod: 'headless' });
            const data = await response.json();

            const html = (
              `<pre style="background-color:var(--env-ui-color-brand-10);color:var(--env-ui-color-brand-10-contrast);overflow:scroll;padding:1em;"><code>${JSON.stringify(data, null, 2)}</code></pre>`
            );

            return { html };
          }
        },
      ],
    });

    modalDialog.toggle();
  })(window, document)
  