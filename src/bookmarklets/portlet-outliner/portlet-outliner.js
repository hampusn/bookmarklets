import css from './portlet-outliner.css';

((document) => {
  const LINK_ID = 'portlet-outliner';
  const link = document.getElementById(LINK_ID);

  if (link) {
    link.sheet.disabled = !link.sheet.disabled;
  } else {
    document.head.insertAdjacentHTML('beforeend', `<style id="${LINK_ID}">${css}</style>`)
  }
})(document)
