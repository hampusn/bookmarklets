import { compareSemver } from "./semver";

export const sortSamples = samples => [...samples].sort(compareSemver);

export const groupByVersionPrefix = (items, samples) => {
  const sortedSamples = sortSamples(samples);
  const groups = {};
  const unknownGroup = { title: 'Unknown version or not React', items: [] };

  for (const item of items) {
    const { reactVersion } = item;
    const match = [...sortedSamples].reverse().find(sample => reactVersion.startsWith(sample));

    if (match) {
      if (!groups[match]) groups[match] = { title: `React ${match}`, version: match,  items: [] };
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
