import { compareSemver } from "./semver";

/**
 * Sorts array of semantic versions.
 * 
 * @param {string[]} versions 
 * @returns {string[]}
 */
export const sortVersions = versions => [...versions].sort(compareSemver);

/**
 * @typedef {Object} PageApp
 * @property {string} appId
 * @property {string} appVersion
 * @property {string} webAppAopId
 * @property {string} reactVersion
 */

/**
 * @typedef {Object} VersionGroup
 * @property {string} title
 * @property {PageApp[]} items
 * @property {boolean} hasReactVersion
 */

/**
 * @param {PageApp[]} items 
 * @param {string[]} versions 
 * @returns {VersionGroup[]}
 */
export const groupByVersionPrefix = (items, versions) => {
  const sortedVersions = sortVersions(versions);
  const groups = {};
  const unknownGroup = { title: 'Unknown version or not React', items: [], hasReactVersion: false, };

  for (const item of items) {
    const { reactVersion } = item;
    const match = [...sortedVersions].reverse().find(version => reactVersion.startsWith(version));

    if (match) {
      if (!groups[match]) {
        groups[match] = {
          title: `React ${match}`,
          version: match,
          items: [],
          hasReactVersion: true,
        };
      }

      groups[match].items.push(item);
    } else {
      unknownGroup.items.push(item);
    }
  }

  const resultGroups = Object.values(groups).sort((a, b) => {
    const verA = a.version;
    const verB = b.version;

    return compareSemver(verA, verB);
  });

  if (unknownGroup.items.length > 0) {
    resultGroups.push(unknownGroup);
  }

  return resultGroups;
};
