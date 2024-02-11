import { Formatter } from './Formatters';

const CLASS_BASE = 'env-modal-dialog';
const ACTIVE_CLASS = 'env-button--primary';
const DOCUMENT = window.document;
const ENVISION = window.envision;

/**
 * Creates the HTML markup for an envision dialog.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.dialogId A unique html ID for the dialog.
 * @param {string} [options.views=[]]
 * @returns {string}
 */

export class Dialog {
  constructor ({ dialogId, views = [] }) {
    this.id = dialogId;
    this.views = views;
    this.current = 0;
    this.isLoading = false;
  
    this.tid = dialogId + '-t';
    this.cid = dialogId + '-c';
    this.bid = dialogId + '-b';
    this.bgid = dialogId + '-bg';
  }

  el (id) {
    return DOCUMENT.getElementById(id);
  } 

  init () {
    const dialogId = this.id;
    const titleId = this.tid;
  
    if (this.el(dialogId)) {
      return this;
    }
  
    // Insert dialog into end of body and show dialog with envision.
    DOCUMENT.body.insertAdjacentHTML('beforeend', (
    `<div id="${dialogId}" class="${CLASS_BASE} ${CLASS_BASE}--inner-scroll" style="z-index:99999" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-hidden="true" tabindex="-1">
      <div class="${CLASS_BASE}__dialog ${CLASS_BASE}__dialog--large">
        <section class="${CLASS_BASE}__content">
          <header class="${CLASS_BASE}__header">
            <h5 id="${titleId}" class="env-text ${CLASS_BASE}__header__title">Sitevision inspector</h5>
            <div id="${this.bgid}" class="env-button-group env-m-top--small">
              ${this.views.map((view, i) => `<button id="${this.bid + i}" type="button" class="env-button env-flex__item--grow-1" data-view-index="${i}">${view.name}</button>`).join('')}
            </div>
          </header>
          <div class="${CLASS_BASE}__body">
            <div id="${this.cid}">View properties, nodes and headless data with the buttons above.</div>
          </div>
          <footer class="${CLASS_BASE}__footer ${CLASS_BASE}__footer--right"><button type="button" data-modal-dialog-dismiss class="env-button">Close</button></footer>
        </section>
      </div>
    </div>`
    ));

    this.el(this.bgid).addEventListener('click', async (event) => {
      if (!this.isLoading && /^button$/i.test(event.target.tagName)) {
        this.isLoading = true;
        this.el(this.bid + this.current).classList.remove(ACTIVE_CLASS);
        await this.detach();
        this.current = parseInt(event.target.dataset.viewIndex, 10);
        await this.fetch();
        this.render();
        await this.attach();
        this.el(this.bid + this.current).classList.add(ACTIVE_CLASS);
        this.isLoading = false;
      }
    });
  
    return this;
  }

  updateContent (html) {
    this.el(this.cid).innerHTML = html;
  }

  async attach () {
    const view = this.views[this.current];
    await view.attach.call(view, this);
  }
  async detach () {
    const view = this.views[this.current];
    await view.detach.call(view, this);
  }

  async fetch () {
    const view = this.views[this.current];
    await view.fetchData.call(view, this);
  }

  render () {
    const view = this.views[this.current];
    this.updateContent(view.render.call(view, this));
  }

  show (cb) {
    ENVISION.dialog('#' + this.id, 'show').then(cb);
    return this;  
  }

  hide (cb) {
    ENVISION.dialog('#' + this.id, 'hide').then(cb);
    return this;  
  }

  toggle (cb) {
    ENVISION.dialog('#' + this.id, 'toggle').then(cb);
    return this;  
  }
};

export class DialogView {
  constructor (name, config = {}) {
    this.name = name;
    this._formatter = null;
    this._fetch = null;
    this._attach = null;
    this._detach = null;
    this._data = null;
    this.config = config;
  }

  setData (data) {
    this._data = data;
  }

  async fetchData () {
    if (typeof this._fetch === 'function') {
      this.setData(await this._fetch.call(this));
    }
  }

  async attach (dialog) {
    if (typeof this._attach === 'function') {
      await this._attach.call(this, dialog);
    }
  }

  async detach (dialog) {
    if (typeof this._detach === 'function') {
      await this._detach.call(this, dialog);
    }
  }

  render () {
    if (this._formatter instanceof Formatter) {
      return this._formatter.setData(this._data).render();
    }

    return '';
  }

  formatter (formatter) {
    this._formatter = formatter;
    return this;
  }

  onFetchData (cb) {
    this._fetch = cb;
    return this;
  }

  onAttach (cb) {
    this._attach = cb;
    return this;
  }
  onDetach (cb) {
    this._detach = cb;
    return this;
  }

};

export default Dialog;
