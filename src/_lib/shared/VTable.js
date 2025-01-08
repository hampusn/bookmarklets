import createElement from "./create-element";
import ensureStyles from "./ensure-styles";
import css from "./VTable.css";

const VTABLE_STYLES_ID = '__VTable-styles'
const VTABLE_BASE_CLASS = '__VTable-container';

const DEFAULT_OPTS = {
  height: 300,
  caption: '',
};

export default class VTable {
  constructor (headers, data, options = {}) {
    this.headers = headers;
    this.data = data;
    this.dataFormat = null;
    this.rowHeight = 27.5; // Default height. Is updated on init.
    this.cols = [];
    this.el = null;
    this.bodyEl = null;
    this.pool = [];
    this.opts = { ...DEFAULT_OPTS, ...options };
    this.start = 0;

    this.init();
  }
  
  init () {
    const headers = Object.values(this.headers);
    const opts = this.opts;
    const caption = opts.caption;
    const height = opts.height;

    ensureStyles(VTABLE_STYLES_ID, css);

    this.cols = Object.keys(this.headers);
    this.el = createElement(
      `<div class="${VTABLE_BASE_CLASS}" style="height:${height}px;">
        <table class="env-table env-table--small env-table--hover env-w--100">
          ${!!caption ? `<caption class="env-assistive-text">${caption}</caption>` : ''}
          <thead class="env-d--block env-w--100"><tr class="env-d--flex">${headers.map((h, i) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody class="env-d--block" style="height:${height}px;"></tbody>
        </table>
      </div>`
    );

    this.bodyEl = this.el.querySelector('tbody');
  }

  setData (data) {
    this.data = !Array.isArray(data) ? [] : data.map((dataRow, rowIndex) => {
      dataRow.$index = rowIndex + 1;
      return dataRow;
    });

    this.numRows = this.data.length;
  }

  getRowData (rowIndex) {
    return this.data[rowIndex];
  }

  renderRows (scrollTop, force = false) {
    const newStart = Math.floor(scrollTop / this.rowHeight);

    if (force || this.start !== newStart) {
      this.start = newStart;

      for (let i = 0; i < this.pool.length; i++) {
        const rowIndex = this.start + i;

        if (rowIndex < this.numRows) {
          const row = this.pool[i];
          const rowCells = row.children;
          
          // Update columns with data for the row
          for (const [ columnIndex, columnKey ] of this.cols.entries()) {
            rowCells[columnIndex].textContent = this.data[rowIndex][columnKey];
          }
          
          row.dataset.rowIndex = rowIndex;
          row.style.transform = `translateY(${rowIndex * this.rowHeight}px)`;
          row.style.display = ''; // TODO: Do I really need to hide/show these anymore? Should always only be 2 extra.
        } else {
          this.pool[i].style.display = 'none'; // TODO: Same here. Needed?
        }
      }
    }
  }

  computeRowHeight () {
    const tr = createElement(`<tr><td>&nbsp;</td></tr>`);
    this.bodyEl.appendChild(tr);
    this.rowHeight = tr.getBoundingClientRect().height; // offsetHeight;
    this.bodyEl.removeChild(tr);
    
    return this.rowHeight;
  }

  computeVisibleRows () {
    const visibleRows = Math.max(Math.ceil(this.el.clientHeight / this.rowHeight) + 2, 10); // Number of visible rows, plus buffer

    return visibleRows;
  }

  resetPool () {
    const visibleRows = this.computeVisibleRows();

    this.pool = [];
    this.bodyEl.innerHTML = '';

    for (let i = 0; i < visibleRows; i++) {
      const tr = createElement(`<tr>${'<td></td>'.repeat(this.cols.length)}</tr>`);
      this.pool.push(tr);
      this.bodyEl.appendChild(tr);
    }
  }

  computeTableDimensions () {
    this.computeRowHeight();
    this.computeVisibleRows();
    this.resetPool();

    this.bodyEl.style.height = (this.numRows * this.rowHeight) + 'px';
  }

  renderTo (target) {
    target.appendChild(this.el);

    this.el.addEventListener('scroll', () => {
      this.renderRows(this.el.scrollTop);
    });

    this.renderRows(0, true);
  }

  onRowClick (callback) {
    if (typeof callback === 'function') {
      this.bodyEl.addEventListener('click', (event) => {
        const eventTarget = event.target;
        const rowIndex = parseInt((eventTarget?.tagName === 'TR' ? eventTarget : eventTarget.closest('tr'))?.dataset.rowIndex, 10);
        
        if (Number.isInteger(rowIndex)) {
          const rowData = this.getRowData(rowIndex);

          callback.call(null, rowData, rowIndex);
        }
      });
    }
  }

  update (data) {
    this.setData(data);

    this.bodyEl.style.height = (this.numRows * this.rowHeight) + 'px';

    // Reset scroll when updating data
    this.el.scrollTop = 0;
    this.renderRows(0, true);
  }
}
