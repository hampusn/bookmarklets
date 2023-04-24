export const OFFLINE = 0;
export const ONLINE = 1;

/**
 * Performs a fetch request to the Sitevision Rest API.
 * 
 * @param {object} options An object literal with options.
 * @param {string} options.nodeId The node identifier to perform the api request on.
 * @param {number} [options.version=ONLINE] The version to use.
 * @param {string} [options.apiMethod='nodes'] The API method to call. (Usually one of: 'nodes', 'properties', 'contentNodes', 'headless')
 * @param {object} [options.options={}] Options to be passed to the API method.
 * @param {string} [options.origin=window.location.origin] The origin to send the request to.
 * @returns {Response}
 */
export default async function sitevisionApi ({ nodeId, version = ONLINE, apiMethod = 'nodes', options = {}, origin = window.location.origin }) {
  const apiParams = encodeURIComponent(JSON.stringify(options));
  const fetchOpts = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const v = [OFFLINE, ONLINE].includes(version) ? version : ONLINE;
  const url = `${origin}/rest-api/1/${v}/${nodeId}/${apiMethod}?format=json&json=${apiParams}`;
  const response = await fetch(url, fetchOpts);
  
  return response;
}
