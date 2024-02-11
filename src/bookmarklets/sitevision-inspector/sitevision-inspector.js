import { Dialog, DialogView } from './Dialog';
import Formatters from './Formatters';
import NodeTypes from './NodeTypes';
import sitevisionApi from './sitevision-api';

((window) => {
  const { pageId: nodeId } = window.sv?.PageContext || {};
  new Dialog({
    dialogId: 'sitevision-inspector-dialog',
    views: [
      new DialogView('Properties')
        .onFetchData(async function () {
          const response = await sitevisionApi({ nodeId, apiMethod: 'properties' });
          const data = await response.json();
  
          return data;
        })
        .formatter(new Formatters.TableFormatter()),
      
      new DialogView('Nodes', {
        breadcrumbs: [],
        async fetchNodes (id) {
          const options = {
            includes: [ NodeTypes.PAGE, NodeTypes.FOLDER, NodeTypes.ARCHIVE, NodeTypes.ARTICLE ],
            properties: [ "URI" ]
          };
          const response = await sitevisionApi({ nodeId: id, apiMethod: 'nodes', options });
          const data = await response.json();
  
          return data;
        }
      })
        .onFetchData(async function () {
          return await this.config.fetchNodes(nodeId);
        })
        .formatter(new Formatters.ListFormatter({ emptyText: 'No nodes found' }))
        .onAttach(async function (dialog) {
          const breadcrumbs = this.config.breadcrumbs = [ nodeId ];
          this.onClick = async (event) => {
            const target = event.target;
            if (/^button$/i.test(target.tagName)) {
              let id = target.dataset.nodeId;

              if (id === 'back') {
                breadcrumbs.pop();
              } else {
                breadcrumbs.push(id);
              }
              
              id = breadcrumbs[breadcrumbs.length - 1];

              const data = await this.config.fetchNodes(id);
              
              if (id !== nodeId) {
                data.unshift({
                  type: 'back',
                  id: 'back',
                  name: 'Go back',
                });
              }

              this.setData(data);
              dialog.render();
            }
          };

          dialog.el(dialog.cid).addEventListener('click', this.onClick);
        })
        .onDetach(async function (dialog) {
          dialog.el(dialog.cid).removeEventListener('click', this.onClick);
        }),

      new DialogView('Headless')
        .onFetchData(async function () {
          const response = await sitevisionApi({ nodeId, apiMethod: 'headless' });
          const data = await response.json();

          return data;
        })
        .formatter(new Formatters.JsonFormatter()),
    ],
  })
    .init()
    .toggle();
})(window)
  