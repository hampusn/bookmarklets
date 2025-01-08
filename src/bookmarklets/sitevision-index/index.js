import createElement from '../../_lib/shared/create-element';
import { getCache, getInstance, removeInstance } from '../../_lib/shared/Dialog';
import VTable from '../../_lib/shared/VTable';
import uid from '../../_lib/shared/uid';
import Events from '../../_lib/shared/Events';
import sitevisionApi from '../../_lib/shared/sitevision-api';
import toasts from '../../_lib/shared/toasts';

(async (window, document) => {
  // Bail early if envision is not found.
  if (!window.envision) {
    console.warn('Envision not found. Exiting since most likely not Sitevision.');
    return;
  }

  const SITEVISION_INDEX_DIALOG = 'sitevision-index-dialog';
  const SITEVISION_INDEX_ROW_DIALOG = `${SITEVISION_INDEX_DIALOG}_row`;

  let indexes;
  if (!document.getElementById(SITEVISION_INDEX_DIALOG)) {
    try {
      indexes = await sitevisionApi({ nodeId: `${window.sv.PageContext.siteId}_indexRepository` });
    } catch (e) {
      toasts.publish({ message: String(e) });

      return;
    }
  }

  const instance = getInstance(SITEVISION_INDEX_DIALOG, { title: 'Sitevision index', size: 'large' });
  let rowDialogInstance = getCache(SITEVISION_INDEX_ROW_DIALOG);

  await instance.init(async (dialog) => {
    const container = createElement('<div></div>');
    const searchFieldId = uid();
    const indexFieldId = uid();
    const searchForm = createElement(
      `<form class="env-form">
        <div class="env-form__row">
          <div class="env-form-element">
            <label for="${indexFieldId}" class="env-form-element__label">Index</label>
            <div class="env-form-element__control">
              <select class="env-form-input" id="${indexFieldId}" name="index">
                ${indexes.map((idx) => `<option value="${idx.id}">${idx.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="env-form-element env-form-element--2">
            <label for="${searchFieldId}" class="env-form-element__label">Search query</label>
            <div class="env-form-element__control env-form-input-group">
              <input id="${searchFieldId}" type="search" name="query" class="env-form-input env-form-input--search env-flex__item--length-1" placeholder="" />
              <button type="submit" class="env-button env-button--primary">Search</button>
            </div>
          </div>
        </div>
      </form>`
    );

    const info = createElement(`<p class="env-text env-m-bottom--small" style="display:none;"></p>`);

    container.appendChild(searchForm);
    container.appendChild(info);

    const headers = { '$index': 'No.', 'name': 'Name' };
    const resultsTable = new VTable(headers, [], {});

    resultsTable.onRowClick((rowData, rowIndex) => {
      const rowTitle = rowData.name || rowData.title;
      rowDialogInstance = getInstance(SITEVISION_INDEX_DIALOG + '_row', { title: rowTitle, size: 'large', closeText: 'Go back' });
      dialog.setDisabled(true);

      const rows = Object.entries(rowData).reduce(function (acc, [ key, value ]) {
        if (key[0] === '$') {
          return acc;
        }
        if (Array.isArray(value)) {
          for (let v of value) {
            acc.push([key, v]);
          }
        } else {
          acc.push([key, value]);
        }
        return acc;
      }, []);

      rowDialogInstance.init(`<table class="env-table env-table--small env-table--zebra env-w--100"><caption class="env-assistive-text">Indexed fields for: ${rowTitle}</caption><thead><th>Field</th><th>Value</th></thead><tbody>${rows.map(([ field, value ]) => `<tr><td style="max-width:28rem;overflow-wrap:break-word;white-space:normal;">${field}</td><td>${value}</td></tr>`).join('')}</tbody></table>`);
      rowDialogInstance.onClosed((rowDialog) => {
        dialog.setDisabled(false);
        removeInstance(rowDialog.id);
        rowDialogInstance = null;
      });
      rowDialogInstance.toggle();
    });

    resultsTable.renderTo(container);

    dialog.context.vTable = resultsTable;
    dialog.context.searchForm = searchForm;

    resultsTable.el.style.display = 'none';

    const searchField = searchForm.querySelector('[name="query"]');
    const indexField = searchForm.querySelector('[name="index"]');
    let slowQueryTimerId;

    Events.onSubmit(searchForm, async (event) => {
      event.preventDefault();

      if (slowQueryTimerId) {
        clearTimeout(slowQueryTimerId);
        slowQueryTimerId = null;
      }

      slowQueryTimerId = setTimeout(() => dialog.setLoading(true), 300);

      const query = searchField.value;
      const index = indexField.value;
      const [ result, err ] = await sitevisionApi({ nodeId: index, apiMethod: 'search', options: { query, limit: 500, fields: [ '*' ] }, returnError: true });
      const hasResult = !err && result?.length > 0;

      clearTimeout(slowQueryTimerId);
      slowQueryTimerId = null;
      dialog.setLoading(false);
      dialog.renderError(err);

      resultsTable.el.style.display = hasResult ? '' : 'none';
      info.style.display = '';
      info.innerHTML = hasResult ? `${result.length}${result.length === 500 ? ` (or more)` : ''} hits found.` : 'No search hits found.';

      if (hasResult && !resultsTable.rowHeight) {
        resultsTable.computeTableDimensions();
      }

      resultsTable.update(result);
    });

    Events.onKeydown(searchField, (event) => {
      // Prevent Escape from hiding modal if clearing filter input by escape key.
      // When the filter input is empty, act as normal.
      if (event.key === 'Escape' && !!event.target.value) {
        event.stopImmediatePropagation();
      }
    });

    return container;
  });

  instance
    .onClose(() => {
      if (rowDialogInstance) {
        rowDialogInstance.hide();
        rowDialogInstance = null;
      }
    })
    .onClosed((dialog) => {
      if (rowDialogInstance) {
        dialog.setDisabled(false);
      }
    })
    .toggle((dialog) => {
      dialog.context.vTable?.computeTableDimensions();
      dialog.context.vTable?.renderRows(dialog.context.vTable.el.scrollTop, true);
    });
})(window, window.document)
