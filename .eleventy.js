const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { parseISO, isDate, format } = require('date-fns');
const prettyBytes = require('pretty-bytes');

module.exports = function (eleventyConfig) {
  // Config
  eleventyConfig.setLiquidOptions({
    jsTruthy: true
  });
  eleventyConfig.addWatchTarget('./src/**/*');
  eleventyConfig.addPassthroughCopy({
    'src/_assets/fonts': 'assets/fonts',
    'node_modules/@mdi/font/fonts': 'assets/fonts',
  });
  eleventyConfig.addPassthroughCopy('./src/**/*.gif');

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Filters
  eleventyConfig.addFilter('templateBodyClass', (template) => {
    const tpl = String(template)
      .toLowerCase()
      .replace(/(\..*)$/, '')
      .replace(/([^a-z0-9]+)/g, '-');

    return `template-${tpl}`;
  });
  eleventyConfig.addFilter('debug', (obj) => {
    return `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`;
  });
  eleventyConfig.addFilter('dateFormat', (date, dateFormat = 'yyyy-MM-dd') => {
    return date ? format(isDate(date) ? date : parseISO(date), dateFormat) : '';
  });
  eleventyConfig.addFilter('size', (size) => prettyBytes(size));

  // Collections
  eleventyConfig.addCollection('bookmarklets', (collectionApi) => {
    return collectionApi.getAll()
      .filter((item) => !!item.data.bookmarkUrl)
      .sort((a, b) => b.date - a.date);
  });

  // Return config object
  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data',
      layouts: '_includes/layouts'
    }
  }
};
