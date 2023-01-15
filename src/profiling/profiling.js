((location, document) => {
  const params = (new URL(location)).searchParams;
  const currentState = getCurrentState(params);

  // Toggle state.
  params.set('profiling', currentState ? 'false' : 'true');
  // Update query string.
  location.search = '?' + params.toString();

  /**
   * Gets the current state of profiling. Returns true if profiling is active, false otherwise.
   * 
   * @param {URLSearchParams} params 
   * @returns {boolean}
   */
  function getCurrentState (params) {
    // Check if search param is already present and use that.
    if (params.has('profiling')) {
      return params.get('profiling').toLowerCase() === 'true';
    }

    // Fallback to searching for the most likely table.
    return [...document.getElementsByTagName('table')].filter(table => table.textContent.search(/Profiling results/i) !== -1).length > 0;
  }
})(location, document)
