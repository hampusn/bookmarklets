import { Dialog, DialogView } from './Dialog';
import Formatters from './Formatters';
import NodeTypes from './NodeTypes';
import sitevisionApi from '../../_lib/shared/sitevision-api';
import Events from '../../_lib/shared/Events';

((window) => {
  const { pageId: nodeId } = window.sv?.PageContext || {};


  // Bail early if envision is not found.
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  new Dialog({
    dialogId: 'sitevision-inspector-dialog',
    views: [
      // Properties view
      new DialogView('Properties')
        .onFetchData(async function () {
          return await sitevisionApi({ nodeId, version: this.dialog.version, apiMethod: 'properties' });
        })
        .formatter(new Formatters.TableFormatter()),
      
      // Nodes view
      new DialogView('Nodes', {
        breadcrumbs: [],
      })
        .onFetchData(async function (id = nodeId) {
          const options = {
            includes: Object.values(NodeTypes),
            properties: [ 'URI' ]
          };
          return await sitevisionApi({ nodeId: id, version: this.dialog.version, apiMethod: 'nodes', options });
        })
        .formatter(new Formatters.ListFormatter({ emptyText: 'No nodes found' }))
        .onAttach(async function () {
          const dialog = this.dialog;
          const breadcrumbs = this.config.breadcrumbs = [ nodeId ];

          this.onClick = async (event) => {
            const target = event.target;
            const BACK = 'back';
            if (!this.isLoading && /^button$/i.test(target.tagName)) {
              let id = target.dataset.nodeId;

              if (id === BACK) {
                breadcrumbs.pop();
              } else {
                breadcrumbs.push(id);
              }
              
              id = breadcrumbs[breadcrumbs.length - 1];

              dialog.setLoading(true);
              const data = await this.fetchData(id);
              
              if (id !== nodeId) {
                data.unshift({
                  type: BACK,
                  id: BACK,
                  name: 'Go back',
                });
              }

              this.setData(data);
              dialog.render();
              dialog.setLoading(false);
            }
          };

          Events.onClick(dialog.el(dialog.cid), this.onClick);
        })
        .onDetach(async function () {
          const dialog = this.dialog;
          Events.offClick(dialog.el(dialog.cid), this.onClick);
        }),

      // Headless view
      new DialogView('Headless')
        .onFetchData(async function () {
          return await sitevisionApi({ nodeId, version: this.dialog.version, apiMethod: 'headless' });
        })
        .formatter(new Formatters.JsonFormatter()),
    ],
  })
    .init()
    .toggle();
})(window)
