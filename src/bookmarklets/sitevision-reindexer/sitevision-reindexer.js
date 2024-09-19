import Dialog from './Dialog';
import editApi from './edit-api';
import Events from './Events';

((window) => {
  const { pageId: nodeId } = window.sv?.PageContext || {};

  console.dir(jQuery.fn);

  // Bail early if envision is not found.
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  if (!jQuery?.fn.fancytree) {

  }

  return;

  new Dialog({
    dialogId: 'sitevision-reindexer-dialog',
  })
    .init()
    .toggle();
})(window)


/*

boostrapData.treeData
editor.appContext.nodeId

*/
