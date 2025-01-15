module.exports = {
  files: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.files,
  bookmarkUrl: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.bookmarkUrl,
  size: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.bookmarkUrl.length,
  replacedBy: (data) => {
    const ref = data.collections.bookmarklets.find(bm => bm.page.fileSlug === data.replacedBy);

    if (ref) {
      return {
        title: ref.data.title,
        url: ref.page.url,
      };
    }

    return null;
  },
  updated: (data) => data.updated || '',
  permalink(data) {
    // If the page is in `draft:true` mode, don't write it to disk...
    if (data.metadata.isProd && data.draft) {
      return false;
    }
    // Return the original value (which could be `false`, or a custom value,
    // or default empty string).
    return data.permalink;
  },
  eleventyExcludeFromCollections(data) {
    // If the page is in `draft:true` mode, or has `permalink:false` exclude
    // it from any collections since it shouldn't be visible anywhere.
    if ((data.metadata.isProd && data.draft) || data.permalink === false) {
      return true;
    }
    return data.eleventyExcludeFromCollections;
  },
};
