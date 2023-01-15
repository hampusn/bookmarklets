module.exports = {
  files: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.files,
  bookmarkUrl: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.bookmarkUrl,
  size: (data) => data.bookmarklets?.find(bm => bm.name === data.page.fileSlug)?.bookmarkUrl.length,
  updated: (data) => data.updated || '',
};
