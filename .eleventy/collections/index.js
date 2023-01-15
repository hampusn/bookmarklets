const glob = require('glob');
const path = require('path');

module.exports = (eleventyConfig) => {
  const files = glob.sync(path.join(__dirname, './*.js'), { ignore: [ '**/index.js' ] });

  for (const file of files) {
    const collection = require(file);
    
    if (collection.name && collection.collection) {
      eleventyConfig.addCollection(collection.name, collection.collection);
      console.log('Registered collection ', collection.name);
    }
  }
};
