import FilterableList from './lib/FilterableList';

((window, document) => {
  const filtersEl = document.getElementById('front-filters');

  if (!filtersEl) {
    return;
  }

  window.addEventListener('load', () => {
    const filterableList = new FilterableList(document.querySelectorAll('.front-bookmarklets__item'));

    filterableList.addFilter(filtersEl.querySelector('[name="hideDiscontinued"]'), (item, filterValue) => {
      if (!filterValue){
        return false;
      }

      const boolVal = item.discontinued === "true";
      return boolVal === filterValue;
    });

    filtersEl.hidden = false;
    filterableList.applyFilters();
  });
})(window, document);
