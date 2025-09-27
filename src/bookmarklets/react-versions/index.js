import createElement from '../../_lib/shared/create-element';
import { getInstance } from '../../_lib/shared/Dialog';
import { REG_APP_INFO, REG_REACT_SCRIPT_VERSION } from './patterns';
import { groupByVersionPrefix } from './utils';

(async (window, document) => {
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  (await getInstance('react-versions-dialog', {
    title: 'React versions',
    size: 'large',
  })
    .init(() => {
      const scripts = [...document.scripts];
      const loadedVersions = scripts.map(s => REG_REACT_SCRIPT_VERSION.exec(s.src)?.[1].replaceAll('_', '.')).filter(v => !!v);
      const pageApps = scripts
        .filter(s => s.textContent.startsWith('AppRegistry.registerApp({'))
        .map(s => REG_APP_INFO.exec(s.textContent)?.slice(1))
        .filter(s => !!s)
        .map(([ appId, appVersion, webAppAopId, reactVersion = '' ]) => ({ appId, appVersion, webAppAopId, reactVersion }));

      const uniquePageApps = [...new Map(pageApps.map(a => [a.webAppAopId, a])).values()];
      const groupedApps = groupByVersionPrefix(uniquePageApps, loadedVersions);
      const container = createElement('<div></div>');

      const versionsText = (() => {
        switch (loadedVersions.length) {
          case 0:
            return "Could not find any React version at all, which is probably good.";
          case 1:
            return `Found one version of React (${loadedVersions[0]}) which is good. This means that you are not loading multiple versions, which would have resulted in a heavier page load.`;
          default:
            return `Found multiple versions of React (${loadedVersions.join(', ')}) which is bad. This most likely results in a heavier page load for the users.`;
        }
      })();
      container.appendChild(createElement(`<p>${versionsText}</p>`));

      let first = true;
      for (const group of groupedApps) {
        container.appendChild(createElement(`
          <table class="env-table env-table--zebra env-table--small env-w--100 ${first ? '' : 'env-m-top--large'}">
            <caption>${group.title}</caption>
            <thead><tr><th>App identifier</th><th>App version</th><th>React version</th></tr></thead>
            <tbody>${group.items.map(({ appId, appVersion, reactVersion }) =>
              `<tr><td>${appId}</td><td>${appVersion}</td><td>${reactVersion}</td></tr>`).join('')}
            </tbody>
          </table>
        `));
        first = false;
      }

      return container;
    }))
    .toggle();
})(window, window.document);
