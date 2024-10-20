const DOCUMENT = window.document;
// const ENVISION = window.envision;

export default function createElement (markup) {
  const template = DOCUMENT.createElement('template');
  template.innerHTML = markup;

  return template.content.firstElementChild;
}
