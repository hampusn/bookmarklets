import createElement from '../../_lib/shared/create-element';
import { getInstance } from '../../_lib/shared/Dialog';
import Switch from '../../_lib/shared/Switch';

((window, document) => {
  // Bail early if envision is not found.
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  const LOCATION = window.location;

  const getElement = (selector) => document.querySelector(selector);
  const getSearchParams = () => new URLSearchParams(LOCATION.search);

  const updateSearchParam = (param, value) => {
    const searchParams = getSearchParams();

    searchParams.set(param, value);
    LOCATION.search = searchParams;
  };

  getInstance('sitevision-development-dialog', {
    title: 'Sitevision development',
  })
    .init(() => {
      const PROFILING_PARAM = 'profiling';
      const JSDEBUG_PARAM = 'jsdebug';
      const VERSION_PARAM = 'version';
      const switchesContainer = createElement('<div></div>');
      
      new Switch({
        label: 'Profiling',
        description: 'Shows a table with render times of all portlets on page.',
        changeCallback (instance, e) {
          updateSearchParam(PROFILING_PARAM, !instance.check());
        },
        checkCallback () {
          const searchParams = getSearchParams();
          
          if (searchParams.has(PROFILING_PARAM)) {
            return searchParams.get(PROFILING_PARAM) === 'true';
          }
          
          // Profiling is active if a table exist at the top of body and contains the text "Profiling".
          return getElement('body > div:not(.sv-layout) > table')?.textContent.trim().startsWith('Profiling');
        }
      }).appendTo(switchesContainer);

      new Switch({
        label: 'Javascript Debug',
        description: 'Disables minification and bundling of stylesheets and client scripts.',
        changeCallback (instance, e) {
          updateSearchParam(JSDEBUG_PARAM, !instance.check());
        },
        checkCallback () {
          const searchParams = getSearchParams();

          if (searchParams.has(JSDEBUG_PARAM)) {
            return searchParams.get(JSDEBUG_PARAM) === 'true';
          }

          // Javascript Debug is deemed to be active if bundle files webapp-assets.js (requires at least one webapp visible)
          // and sv-template-asset.css (requires at least one css file on page/template).
          // Will fail if no custom css or webapp exists on the rendered page.
          return !(
               getElement('body > script[src$="/webapp-assets.js"]')
            || getElement('head > link[href$="sv-template-asset.css"]')
          );
        }
      }).appendTo(switchesContainer);

      // Offline version is only usable by authenticated users.
      if (document.body.classList.contains('sv-editing-mode') || getElement('body > iframe[src*="/edit-editormenu/"]')) {
        new Switch({
          label: 'Offline verison',
          description: 'View the version used when editing in the Sitevision editor, but without the editor interface.',
          changeCallback (instance, e) {
            const searchParams = getSearchParams();
            
            if (instance.check()) {
              searchParams.delete(VERSION_PARAM);
            } else {
              searchParams.set(VERSION_PARAM, '0');
            }
  
            LOCATION.search = searchParams;
          },
          checkCallback () {
            return getSearchParams().get(VERSION_PARAM) === '0';
          }
        }).appendTo(switchesContainer);
      }

      return switchesContainer;
    })
    .toggle();
})(window, window.document)
