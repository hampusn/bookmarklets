import Events from './Events';

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
  constructor ({ dialogId, views = [] }) {
    this.id = dialogId;
    this.views = views;
    this.current = 0;
    this.isLoading = false;
    this.version = 1;
  
    this.tid = dialogId + '-t'; // title
    this.cid = dialogId + '-c'; // content
    this.bid = dialogId + '-b'; // button id prefix
    this.bgid = dialogId + '-bg'; // button group
    this.fid = dialogId + '-f'; // footer
    this.lid = dialogId + '-l'; // loader

    this.views.forEach((view) => view.setDialog(this));
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
            <h5 id="${titleId}" class="env-text env-d--flex env-flex--align-items-center env-flex--justify-content-between ${CLASS_BASE}__header__title">
              Sitevision inspector
              <div id="${this.lid}" class="${SPINNER_CLASS} ${SPINNER_CLASS}--hide ${SPINNER_CLASS}--fade-in" data-delay="medium">
                ${[1,2,3].map(i => `<div class="env-bounce${i}"></div>`).join('')}
              </div>
            </h5>
            <div id="${this.bgid}" class="env-button-group env-m-top--small">
              ${this.views.map((view, i) => `<button id="${this.bid + i}" type="button" class="env-button env-flex__item--grow-1" data-view-index="${i}">${view.name}</button>`).join('')}
            </div>
          </header>
          <div class="${CLASS_BASE}__body">
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

    const buttonsCallback = async (event) => {
      if (!this.isLoading && /^button$/i.test(event.target.tagName)) {
        this.setLoading(true);
        this.el(this.bid + this.current).classList.remove(ACTIVE_CLASS);
        await this.detach();
        this.current = parseInt(event.target.dataset.viewIndex, 10);
        await this.fetch();
        this.render();
        await this.attach();
        this.el(this.bid + this.current).classList.add(ACTIVE_CLASS);
        this.setLoading(false);
      }
    };

    Events.onClick(this.el(this.bgid), buttonsCallback);
    Events.onChange(this.el(this.fid), async (event) => {
      this.version = parseInt(event.target.value, 10);

      buttonsCallback({
        target: this.el(this.bid + this.current)
      });
    });
  
    return this;
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

  render () {
    const view = this.views[this.current];
    const renderedView = view.render.call(view);

    if (renderedView) {
      this.updateContent(renderedView);
    }
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

export default Dialog;
