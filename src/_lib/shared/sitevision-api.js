export const OFFLINE = 0;
export const ONLINE = 1;

/**
 * Performs a fetch request to the Sitevision Rest API.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.nodeId The node identifier to perform the api request on.
 * @param {string} options.path The path to perform the api request on.
 * @param {string} options.siteName The site's name. Required when using path.
 * @param {number} [options.version=ONLINE] The version to use.
 * @param {string} [options.apiMethod='nodes'] The API method to call. (Usually one of: 'nodes', 'properties', 'contentNodes', 'headless')
 * @param {object} [options.options={}] Options to be passed to the API method.
 * @param {string} [options.origin=window.location.origin] The origin to send the request to.
 * @returns {Response}
 */
export default async function sitevisionApi ({ nodeId, path, siteName, version = ONLINE, apiMethod = 'nodes', options = {}, origin = window.location.origin }) {
  if (!nodeId && !(path && siteName)) {
    throw 'Api needs either a nodeId or a path.';
  }
  
  const apiParams = encodeURIComponent(JSON.stringify(options));
  const fetchOpts = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const v = [OFFLINE, ONLINE].includes(version) ? version : ONLINE;
  const url = `${origin}/rest-api/1/${v}/${nodeId || (siteName + '/' + path.replace(/^\/|\/$/, ''))}/${apiMethod}?format=json&json=${apiParams}`;

  if (v === OFFLINE) {
    fetchOpts.credentials = 'same-origin';
  }

  const response = await fetch(url, fetchOpts);
  let data = {};
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    throw [
      `Status ${response.status}`,
      data?.description,
      data?.message,
    ].filter(v => !!v).join(', ');
  }

  return data;
}
