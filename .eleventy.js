const { globSync } = require('glob');
const fs = require('fs');

module.exports = function (eleventyConfig) {
  const config = {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data',
      layouts: '_includes/layouts'
    }
  };

  // Config
  eleventyConfig.setLiquidOptions({
    jsTruthy: true
  });
  eleventyConfig.setServerPassthroughCopyBehavior('copy'); // Eleventy fails on fonts copy when not used.
  eleventyConfig.addWatchTarget('./src/bookmarklets/**/*');
  eleventyConfig.addPassthroughCopy({
    'node_modules/@mdi/font/fonts': 'assets/fonts',
    './src/_assets/fonts': 'assets/fonts',
  });

  // eleventyConfig.addPassthroughCopy does not support changing target path
  // so I had to write custom copy with glob below.
  const files = globSync(`./${config.dir.input}/bookmarklets/**/*.{gif,png,jpg,webp}`);

  for (const file of files) {
    const target = file.replace(`${config.dir.input}/bookmarklets`, config.dir.output);
    fs.cp(file, target, (err) => {
      if (err) {
        console.error(`Could not copy bookmarklet asset: ${file}`, err);
      } else {
        console.log(`Copied bookmarklet asset: ${file}`);
      }
    });
  }

  require('./.eleventy/collections')(eleventyConfig);
  require('./.eleventy/filters')(eleventyConfig);
  require('./.eleventy/plugins')(eleventyConfig);

  // Return config object
  return config;
};
