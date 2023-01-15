const glob = require('glob');
const path = require('path');

module.exports = (eleventyConfig) => {
  const files = glob.sync(path.join(__dirname, './*.js'), { ignore: [ '**/index.js' ] });

  for (const file of files) {
    const filter = require(file);
    
    if (filter.name && filter.filter) {
      eleventyConfig.addFilter(filter.name, filter.filter);
      console.log('Registered filter ', filter.name);
    }
  }
};
