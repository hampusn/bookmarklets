export default class FilterableList {
  constructor (items = []) {
    this.items = items instanceof NodeList ? [ ...items ] : items;
    this.filters = [];
    this.activeFilters = {};
    this.index = [];

    this.buildIndex();
  }

  /**
   * 
   * @private
   * @param {IndexItem} item 
   * @returns {boolean}
   */
  _itemFilter (item) {
    return this.filters.every(([ name, filterCallback ]) => {
      return filterCallback.call(null, item, this.activeFilters[name]);
    });
  }

  getFilterValue (element) {
    if (element instanceof HTMLInputElement) {
      switch (element.type) {
        case 'checkbox':
        case 'radio':
          return element.checked;
        default:
          return element.value;
      }
    }

    if (element instanceof HTMLSelectElement) {
      return element.value;
    }

    return null;
  }

  addFilter (formElement, filterCallback, { eventType = 'change', instant = true } = {}) {
    this.filters.push([ formElement.name, filterCallback ]);
    this.activeFilters[formElement.name] = this.getFilterValue(formElement);

    formElement.addEventListener(eventType, (event) => {
      this.activeFilters[formElement.name] = this.getFilterValue(formElement);

      if (instant) {
        this.applyFilters();
      }
    });

    return this;
  }

  buildIndex () {
    this.index = [];

    for (const [ i, item ] of this.items.entries()) {
      this.index.push({
        ...item.dataset,
        "$summary": item.innerText,
        "$index": i,
      });
    }
  }

  applyFilters () {
    for (const item of this.index) {
      this.items[item.$index].hidden = this._itemFilter(item);
    }
  }
}
