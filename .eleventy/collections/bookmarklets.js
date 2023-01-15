module.exports = {
  name: 'bookmarklets',
  collection (collectionApi) {
    return collectionApi.getAll()
      .filter((item) => !!item.data.bookmarkUrl)
      .sort((a, b) => b.date - a.date);
  }
};
