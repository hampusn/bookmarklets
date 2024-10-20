const CLASS_BASE = 'env-modal-dialog';
const SPINNER_CLASS = 'env-spinner-bounce';
const DOCUMENT = window.document;
const ENVISION = window.envision;

/**
 * Creates the HTML markup for an envision dialog.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.dialogId A unique html ID for the dialog.
 * @param {string} options.title
 * @returns {string}
 */

export class Dialog {
  constructor ({ dialogId, title, size }) {
    this.id = dialogId;
    this.isLoading = false;
    this.title = title;
    this.size = size;
  
    this.tid = dialogId + '-t'; // title
    this.thid = dialogId + '-th'; // title holder
    this.cid = dialogId + '-c'; // content
    this.fid = dialogId + '-f'; // footer
    this.lid = dialogId + '-l'; // loader
  }

  /**
   * Shortcut for Document.getElementById() for improved minification.
   * 
   * @param {string} id An identifier for an HTMLElement.
   * @returns {(HTMLElement|null)}
   */
  el (id) {
    return DOCUMENT.getElementById(id);
  } 

  /**
   * Initializes the dialog if it hasn't already been initialized.
   * 
   * @param {(Function|String|HTMLElement)} initialContent 
   * @returns {Dialog} Returns self for chainability.
   */
  init (initialContent) {
    const dialogId = this.id;
    const titleId = this.tid;
  
    if (this.el(dialogId)) {
      return this;
    }

    initialContent = typeof initialContent === 'function' ? initialContent.call(this) : initialContent;

    const contentString = typeof initialContent === 'string' ? initialContent : '';
    const sizeClass = this.size ? `${CLASS_BASE}__dialog--${this.size}` : '';
  
    // Insert dialog into end of body and show dialog with envision.
    DOCUMENT.body.insertAdjacentHTML('beforeend', (
    `<div id="${dialogId}" class="${CLASS_BASE} ${CLASS_BASE}--inner-scroll" style="z-index:99999" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-hidden="true" tabindex="-1">
      <div class="${CLASS_BASE}__dialog ${sizeClass}">
        <section class="${CLASS_BASE}__content">
          <header class="${CLASS_BASE}__header">
            <h5 id="${titleId}" class="env-text env-d--flex env-flex--align-items-center env-flex--justify-content-between ${CLASS_BASE}__header__title">
              <span id="${this.thid}">${this.title}</span>
              <div id="${this.lid}" class="${SPINNER_CLASS} ${SPINNER_CLASS}--hide ${SPINNER_CLASS}--fade-in" data-delay="medium">
                ${[1,2,3].map(i => `<div class="env-bounce${i}"></div>`).join('')}
              </div>
            </h5>
          </header>
          <div class="${CLASS_BASE}__body">
            <div id="${this.cid}">${contentString}</div>
          </div>
          <footer id="${this.fid}" class="${CLASS_BASE}__footer env-d--flex env-flex--justify-content-between">
            <button type="button" data-modal-dialog-dismiss class="env-button env-m-left--a">Close</button>
          </footer>
        </section>
      </div>
    </div>`
    ));

    if (initialContent instanceof HTMLElement) {
      this.el(this.cid).appendChild(initialContent);
    }

    return this;
  }

  /**
   * @param {string} title 
   */
  updateTitle (title) {
    this.title = title;
    this.el(this.thid).innerHTML = title;
  }

  /**
   * @param {string} html 
   */
  updateContent (html) {
    this.el(this.cid).innerHTML = html;
  }

  /**
   * @param {boolean} isLoading 
   */
  setLoading (isLoading) {
    this.isLoading = !!isLoading;
    this.el(this.lid).classList.toggle(`${SPINNER_CLASS}--hide`, !this.isLoading);
  }
  
  /**
   * @param {string} errorMessage 
   */
  renderError (errorMessage) {
    this.updateContent(
      `<div class="env-alert env-alert--danger">${errorMessage}</div>`
    );
  }

  /**
   * @param {Function} cb Callback run when Envision.dialog promise has finished.
   * @returns {Dialog}
   */
  toggle (cb) {
    ENVISION.dialog('#' + this.id, 'toggle').then(cb);
    return this;  
  }
};

export default Dialog;

export const getInstance = (function () {
  const instances = {};
  /**
   * @returns {Dialog}
   */
  return function (dialogId, opts = {}) {
    if (!instances[dialogId]) {
      instances[dialogId] = new Dialog({ ...opts, dialogId });
    }

    return instances[dialogId];
  };
})();
