/**
 * Returns version as array of integers. Assumes no text suffix with hyphen exists in string.
 * 
 * @param {string} versionString
 * @
 * @returns {number[]}
 */
export const parseVersion = (versionString) => versionString.split('.').map((part) => parseInt(part, 10));

/**
 * Sort callback for comparing and sorting semver strings.
 * 
 * @param {string} versionStringA 
 * @param {string} versionStringB 
 * @returns 
 */
export const compareSemver = (versionStringA, versionStringB) => {
  const pa = parseVersion(versionStringA);
  const pb = parseVersion(versionStringB);
  const n = Math.max(pa.length, pb.length);

  for (let i = 0; i < n; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;

    if (na !== nb) {
      return na - nb;
    }
  }

  return 0;
};
