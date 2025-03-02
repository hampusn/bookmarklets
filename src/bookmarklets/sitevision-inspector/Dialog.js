import { Formatter } from './Formatters';
import Events from '../../_lib/shared/Events';
import Icons from './Icons';

const CLASS_BASE = 'env-modal-dialog';
const ACTIVE_CLASS = 'env-button--primary';
const SPINNER_CLASS = 'env-spinner-bounce';
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
  constructor ({ dialogId, nodeId, views = [] }) {
    this.id = dialogId;
    this.nodeId = nodeId;
    this.views = views;
    this.current = 0;
    this.isLoading = false;
    this.version = 1;
  
    this.tid = dialogId + '-t'; // title
    this.cid = dialogId + '-c'; // content
    this.ctxid = dialogId + '-ctx'; // context node id field
    this.bid = dialogId + '-b'; // button id prefix
    this.bgid = dialogId + '-bg'; // button group
    this.fid = dialogId + '-f'; // footer
    this.lid = dialogId + '-l'; // loader
    this.sfid = dialogId + '-sf'; // Search filter
    this.siid = dialogId + '-si'; // Search input

    this.views.forEach((view) => view.setDialog(this));
  }

  el (id) {
    return DOCUMENT.getElementById(id);
  } 

  init () {
    const dialogId = this.id;
    const titleId = this.tid;
    const searchInputId = this.siid;
  
    if (this.el(dialogId)) {
      return this;
    }
  
    // Insert dialog into end of body and show dialog with envision.
    DOCUMENT.body.insertAdjacentHTML('beforeend', (
    `<div id="${dialogId}" class="${CLASS_BASE} ${CLASS_BASE}--inner-scroll" style="z-index:99999" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-hidden="true" tabindex="-1">
      <div class="${CLASS_BASE}__dialog ${CLASS_BASE}__dialog--large">
        <section class="${CLASS_BASE}__content">
          <header class="${CLASS_BASE}__header">
            <h5 id="${titleId}" class="env-text env-d--flex env-flex--align-items-center env-flex--justify-content-between ${CLASS_BASE}__header__title">
              Sitevision inspector
              <div id="${this.lid}" class="${SPINNER_CLASS} ${SPINNER_CLASS}--hide ${SPINNER_CLASS}--fade-in" data-delay="medium">
                ${[1,2,3].map(i => `<div class="env-bounce${i}"></div>`).join('')}
              </div>
            </h5>
            <div id="${this.ctxid}" class="env-m-top--small">
              <div class="env-form-element">
                <div class="env-form-element__control env-form-input-group">
                  <label for="${this.ctxid}-f" class="env-form-input-group__label" style="flex-shrink:0">ID</label>
                  <input class="env-form-input" id="${this.ctxid}-f" readonly value="${this.nodeId}">
                  <button data-ctx-action="edit" type="button" class="env-button env-button--primary env-button--icon">
                    Edit context node id
                    ${Icons.EDIT.replace('<svg', '<svg style="pointer-events:none" class="env-icon"')}
                  </button>
                </div>
              </div>
              <button data-ctx-action="save" type="button" class="env-d--none env-button env-button--success env-button--icon">
                Change context node id
                <svg style="pointer-events:none" class="env-icon">
                  <use href="/sitevision/envision-icons.svg#icon-check-line"></use>
                </svg>
              </button>
              <button data-ctx-action="cancel" type="button" class="env-d--none env-button env-button--ghost env-button--danger env-button--icon">
                Cancel change
                <svg style="pointer-events:none" class="env-icon">
                  <use href="/sitevision/envision-icons.svg#icon-delete"></use>
                </svg>
              </button>
            </div>
            <div id="${this.bgid}" class="env-button-group env-m-top--small">
              ${this.views.map((view, i) => `<button id="${this.bid + i}" type="button" class="env-button env-flex__item--grow-1" data-view-index="${i}">${view.name}</button>`).join('')}
            </div>
          </header>
          <div class="${CLASS_BASE}__body">
            <div id="${this.sfid}" class="env-form-element">
              <label for="${searchInputId}" class="env-form-element__label">Filter query</label>
              <div class="env-form-element__control">
                <input type="search" class="env-form-input env-form-input--search" id="${searchInputId}" />
              </div>
            </div>

            <div id="${this.cid}">View properties, nodes and headless data with the buttons above.</div>
          </div>
          <footer id="${this.fid}" class="${CLASS_BASE}__footer env-d--flex env-flex--justify-content-between">
            <fieldset class="env-form-element__control env-d--flex env-flex--align-items-center" style="gap: var(--env-spacing-medium);">
              <legend class="env-form-element__label env-m-bottom--0" style="float: left; font-weight: 700;">Version:</legend>
              <label class="env-radio env-m-bottom--0"><input type="radio" name="version" value="1" checked>Online (Public)</label>
              <label class="env-radio env-m-bottom--0"><input type="radio" name="version" value="0">Offline (Edit)</label>
            </fieldset>
            <button type="button" data-modal-dialog-dismiss class="env-button">Close</button>
          </footer>
        </section>
      </div>
    </div>`
    ));

    const changeView = async (viewIndex) => {
      const currentIndex = this.current;
      const isReload = viewIndex === currentIndex;

      this.setLoading(true);

      if (!isReload) {
        this.el(this.bid + currentIndex).classList.remove(ACTIVE_CLASS);
      }

      await this.detach();
      this.current = viewIndex;
      await this.fetch();
      this.render();
      await this.attach();

      if (!isReload) {
        this.el(this.bid + this.current).classList.add(ACTIVE_CLASS);
      }
      
      this.setLoading(false);
    };

    const reloadView = async () => await changeView(this.current);

    const showCtxButtons = (btns) => {
      this.el(this.ctxid).querySelector('.env-form-input-group').append(...btns);
      btns.forEach(btn => btn.classList.remove('env-d--none'));
    };

    const hideCtxButtons = (btns) => {
      this.el(this.ctxid).append(...btns);
      btns.forEach(btn => btn.classList.add('env-d--none'));
    };

    const ctxButtonCallback = async (event) => {
      if (!this.isLoading && /^button$/i.test(event.target.tagName)) {
        const action = event.target.dataset.ctxAction;
        const ctxContainer = this.el(this.ctxid);
        const ctxInput = ctxContainer.querySelector('input');
        const saveAndCancelBtns = ctxContainer.querySelectorAll('[data-ctx-action="save"], [data-ctx-action="cancel"]');
        const editBtn = ctxContainer.querySelectorAll('[data-ctx-action="edit"]');

        switch (action) {
          case 'edit':
            showCtxButtons(saveAndCancelBtns);
            hideCtxButtons(editBtn);
            ctxInput.readOnly = false;
            break;
          case 'save':
            this.setNodeId(ctxInput.value);
            hideCtxButtons(saveAndCancelBtns);
            showCtxButtons(editBtn);
            ctxInput.readOnly = true;
            await reloadView();
            break;
          case 'cancel':
            hideCtxButtons(saveAndCancelBtns);
            showCtxButtons(editBtn);
            ctxInput.value = this.nodeId;
            ctxInput.readOnly = true;
            break;
        }
      }
    };

    const buttonsCallback = async (event) => {
      if (!this.isLoading && /^button$/i.test(event.target.tagName)) {
        await changeView(parseInt(event.target.dataset.viewIndex, 10));
      }
    };

    const filterInputCallback = (event) => {
      this.applyFilter(event.target.value);
    };

    const filterKeydownCallback = (event) => {
      // Prevent Escape from hiding modal if clearing filter input by escape key.
      // When the filter input is empty, act as normal.
      if (event.key === 'Escape' && !!event.target.value) {
        event.stopImmediatePropagation();
      }
    };

    Events.onClick(this.el(this.ctxid), ctxButtonCallback);
    Events.onClick(this.el(this.bgid), buttonsCallback);
    Events.onInput(this.el(this.siid), filterInputCallback);
    Events.onKeydown(this.el(this.siid), filterKeydownCallback);
    Events.onChange(this.el(this.fid), async (event) => {
      this.version = parseInt(event.target.value, 10);

      await changeView(parseInt(this.el(this.bid + this.current).dataset.viewIndex, 10));
    });
  
    return this;
  }

  setNodeId (nodeId) {
    this.nodeId = String(nodeId).trim();
    this.el(`${this.ctxid}-f`).value = this.nodeId;
  }

  updateContent (html) {
    this.el(this.cid).innerHTML = html;
  }

  async attach () {
    const view = this.views[this.current];
    await view.attach.call(view);
  }
  async detach () {
    const view = this.views[this.current];
    await view.detach.call(view);
  }

  setLoading (isLoading) {
    this.isLoading = !!isLoading;
    this.el(this.lid).classList[this.isLoading ? 'remove' : 'add'](`${SPINNER_CLASS}--hide`);
  }

  async fetch () {
    const view = this.views[this.current];
    const data = await view.fetchData.call(view);
    view.setData(data);
  }

  applyFilter (searchQuery) {
    const view = this.views[this.current];
    const index = view.getIndex();

    if (!index) {
      return;
    }

    const query = (searchQuery ?? this.el(this.siid).value).toLowerCase();

    this.el(this.cid).querySelectorAll('[data-filter-item]').forEach((el, i) => {
      el.style.display = !!query && !index[i].includes(query) ? 'none' : '';
    });
  }

  render () {
    const view = this.views[this.current];
    const renderedView = view.render.call(view);

    if (renderedView) {
      this.updateContent(renderedView);
      this.applyFilter();
    }

    this.el(this.sfid).style.display = view.getIndex() ? '' : 'none';
  }
  
  renderError (errorMessage) {
    this.updateContent(
      `<div class="env-alert env-alert--danger">${errorMessage}</div>`
    );
  }

  toggle (cb) {
    ENVISION.dialog('#' + this.id, 'toggle').then(cb);
    return this;  
  }
};

export class DialogView {
  constructor (name, config = {}) {
    this.name = name;
    this.dialog = null;
    this._formatter = null;
    this._fetch = null;
    this._attach = null;
    this._detach = null;
    this._onUpdateIndex = null;
    this._data = null;
    this._index = null;
    this.config = config;
  }

  setDialog (dialog) {
    this.dialog = dialog;
    return this;
  }

  setData (data) {
    this._data = data;
    this.buildIndex(data);
  }

  getIndex () {
    return this._index;
  }

  buildIndex (data) {
    if (typeof this._buildIndex === 'function') {
      this._index = this._buildIndex.call(this, data)?.map(s => s.toLowerCase());
    }
  }

  async fetchData (...args) {    
    try {
      if (typeof this._fetch === 'function') {
        return await this._fetch.call(this, ...args);
      }
    } catch (e) {
      this.dialog.renderError(String(e));      
    }

    return false;
  }

  async attach () {
    try {
      if (typeof this._attach === 'function') {
        await this._attach.call(this);
      }
    } catch (e) {
      this.dialog.renderError(String(e));
    }
  }

  async detach () {
    try {
      if (typeof this._detach === 'function') {
        await this._detach.call(this);
      }
    } catch (e) {
      this.dialog.renderError(String(e));
    }
  }

  render () {
    if (this._formatter instanceof Formatter && this._data) {
      return this._formatter.setData(this._data).render();
    }

    return '';
  }

  formatter (formatter) {
    this._formatter = formatter;
    return this;
  }

  onBuildIndex (cb) {
    this._buildIndex = cb;
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
