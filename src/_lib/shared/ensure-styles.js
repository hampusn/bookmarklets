const DOCUMENT = window.document;

export default function ensureStyles (id, css) {
  let link = document.getElementById(id);
  
  // https://www.npmjs.com/package/clean-css#minify-method
  // https://github.com/TrySound/rollup-plugin-string/blob/master/index.js

  if (!link) {
    DOCUMENT.head.insertAdjacentHTML('beforeend', `<style id="${id}">${css}</style>`);
    link = document.getElementById(id);
  }

  return link;
}
