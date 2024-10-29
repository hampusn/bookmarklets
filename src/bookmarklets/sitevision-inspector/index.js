import { Dialog, DialogView } from './Dialog';
import Formatters from './Formatters';
import NodeTypes from './NodeTypes';
import sitevisionApi from '../../_lib/shared/sitevision-api';
import Events from '../../_lib/shared/Events';

((window) => {
  const { pageId: nodeId, siteId } = window.sv?.PageContext || {};

  // Bail early if envision is not found.
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  let __siteName;

  new Dialog({
    dialogId: 'sitevision-inspector-dialog',
    views: [
      // Properties view
      new DialogView('Properties')
        .onFetchData(async function () {
          return await sitevisionApi({ nodeId, version: this.dialog.version, apiMethod: 'properties' });
        })
        .onBuildIndex(function (data) {
          return [ ...Object.entries(data) ].map(([ property, value ]) => property + ' ' + value);
        })
        .formatter(new Formatters.TableFormatter({ caption: (data) => `Properties for ${data.articleName || data.displayName}` })),
      
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
        .onBuildIndex(function (data) {
          return data.map(node => node.name);
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

      new DialogView('Search index')
        .onFetchData(async function () {
          if (!__siteName) {
            const siteProps = await sitevisionApi({ nodeId: siteId, version: this.dialog.version, apiMethod: 'properties' });
            
            if (siteProps?.displayName) {
              __siteName = siteProps.displayName;
            } else {
              throw 'Could not read site name.';
            }
          }

          const searchResult = await sitevisionApi({ path: 'Index Repository/Online', siteName: __siteName, version: this.dialog.version, apiMethod: 'search', options: {
            query: `+id:${nodeId}`,
            limit: 1,
            fields: ['*', 'nodeid'],
          } });

          if (searchResult.length === 0) {
            throw 'No indexed data found for current page.';
          }

          return Object.entries(searchResult[0]).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
              for (const v of value) {
                acc.push([key, v]);
              }
            } else {
              acc.push([key, value]);
            }

            return acc;
          }, []);
        })
        .onBuildIndex(function (data) {
          return data.map(([ property, value ]) => property + ' ' + value);
        })
        .formatter(new Formatters.TableFormatter()),
    ],
  })
    .init()
    .toggle();
})(window)
