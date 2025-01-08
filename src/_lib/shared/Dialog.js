import Events from "./Events";

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
  constructor ({ dialogId, title, size, closeText = 'Close' }) {
    this.id = dialogId;
    this.isLoading = false;
    this.isDisabled = false;
    this.title = title;
    this.size = size;
    this.closeText = closeText;
    this.context = {};
  
    this.tid = dialogId + '-t'; // title
    this.thid = dialogId + '-th'; // title holder
    this.cid = dialogId + '-c'; // content
    this.eid = dialogId + '-e'; // error
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
  async init (initialContent) {
    const dialogId = this.id;
    const titleId = this.tid;
  
    if (this.el(dialogId)) {
      return this;
    }

    let initialContentError;

    try {
      initialContent = typeof initialContent === 'function' ? await initialContent.call(null, this) : initialContent;
    } catch (e) {
      initialContentError = e;
    }

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
            <div id="${this.eid}" class="env-alert env-alert--danger" hidden>
              <span data-error-holder></span>
              <button type="button" class="env-alert__close env-button env-button--link env-button--icon env-button--icon-small" data-dismiss="alert">
                Close
                <svg class="env-icon env-icon--xx-small">
                  <use href="/sitevision/envision-icons.svg#icon-delete"></use>
                </svg>
              </button>
            </div>
          </div>
          <footer id="${this.fid}" class="${CLASS_BASE}__footer env-d--flex env-flex--justify-content-between">
            <button type="button" data-modal-dialog-dismiss class="env-button env-m-left--a">${this.closeText}</button>
          </footer>
        </section>
      </div>
    </div>`
    ));

    if (initialContentError) {
      this.renderError(initialContentError);
    }

    Events.onClick(this.el(this.eid).querySelector('[data-dismiss="alert"]'), () => {
      this.renderError('');
    });

    if (initialContent instanceof HTMLElement) {
      this.el(this.cid).appendChild(initialContent);
    }

    return this;
  }

  isOpen () {
    return this.el(this.id)?.classList.contains('env-modal-dialog--show');
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

  setDisabled (isDisabled) {
    this.isDisabled = !!isDisabled;
    this.el(this.id).inert = this.isDisabled;
    this.el(this.cid).style.opacity = this.isDisabled ? 0.5 : 1;
    this.el(this.fid).querySelectorAll('.env-button').forEach((btn) => btn.disabled = this.isDisabled);
  }
  
  /**
   * @param {string} errorMessage 
   */
  renderError (errorMessage) {
    const hasError = !!errorMessage;
    const errorElement = this.el(this.eid);

    errorElement.querySelector('[data-error-holder]').innerHTML = errorMessage;
    errorElement.hidden = !hasError;

    this.el(this.cid).hidden = hasError;
  }

  onClose (callback) {
    if (typeof callback === 'function') {
      // TODO: should probably start using new Dialog api instead of old ModalDialog so we can 
      // remove jQuery as a dependency.
      jQuery('#' + this.id).on('hide.env-modal-dialog', (e) => {
        callback.call(null, this, e);
      });
    }

    return this;
  }

  onClosed (callback) {
    if (typeof callback === 'function') {
      // TODO: should probably start using new Dialog api instead of old ModalDialog so we can 
      // remove jQuery as a dependency.
      jQuery('#' + this.id).on('hidden.env-modal-dialog', (e) => {
        callback.call(null, this, e);
      });
    }

    return this;
  }

  hide (callback) {
    ENVISION.dialog('#' + this.id, 'hide').then(callback ? callback.bind(null, this) : null);
    return this;  
  }

  /**
   * @param {Function} callback Callback run when Envision.dialog promise has finished.
   * @returns {Dialog}
   */
  toggle (callback) {
    ENVISION.dialog('#' + this.id, 'toggle').then(callback ? callback.bind(null, this) : null);
    return this;  
  }

  remove () {
    this.el(this.id).remove();
  }
};

export default Dialog;

/**
 * @returns {Record<string,Dialog>}
 */
export const getCache = (key = null) => {
  const instances = window.__BookmarkletDialogInstances = window.__BookmarkletDialogInstances || {};

  if (key) {
    return instances[key];
  }

  return instances;
};

/**
 * @returns {Dialog}
 */
export const getInstance = (dialogId, opts = {}) => {
  const instances = getCache();

  if (!instances[dialogId]) {
    instances[dialogId] = new Dialog({ ...opts, dialogId });
  }

  return instances[dialogId];
};

export const removeInstance = (dialogId) => {
  const instances = getCache();

  if (instances[dialogId]) {
    instances[dialogId].remove();
    delete instances[dialogId];
  }
};
