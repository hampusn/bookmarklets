const fs = require('fs/promises');
const path = require('path');
const glob = require('glob');
const { rollup } = require('rollup');
const terserPlugin = require('@rollup/plugin-terser');
const { string: stringPlugin } = require('rollup-plugin-string');

module.exports = async function bookmarklets (configData) {
  const items = [];

  console.log('Generating bookmarklets');

  const contentDir = path.join(configData.eleventy.env.root, './src/bookmarklets');
  const directories = (await fs.readdir(contentDir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .map(dirent => dirent.name);

  for (const name of directories) {
    const dirPath = path.join(contentDir, name);
    const scriptPath = path.join(dirPath, `${name}.js`);
    const files = [];

    try {
      const script = await fs.readFile(scriptPath, 'utf8');
      files.push({ name: `${name}.js`, content: script, lang: 'js', });

      // Glob bookmarklet assets and add to files array.
      const assets = glob.sync(path.join(dirPath, `!(index.md|${name}.js|*.gif|*.png|*.jpg|*.webp)`), { nodir: true });
    
      for (const asset of assets) {
        const assetScript = await fs.readFile(asset, 'utf8');
        files.push({
          name: path.basename(asset),
          content: assetScript,
          lang: path.extname(asset).replace(/^\.+/g, ''),
        });
      }

      const bundle = await rollup({
        input: scriptPath,
        plugins: [
          stringPlugin({
            include: path.join(dirPath, '*'),
            exclude: [
              scriptPath,
              path.join(dirPath, 'index.md'),
              path.join(dirPath, '*.{js,gif,png,jpg,webp}'),
            ]
          }),
          terserPlugin()
        ]
      });

      const { output } = await bundle.generate({ format: 'iife' });
      const code = String(output[0].code).trim();

      items.push({
        name,
        files,
        bookmarkUrl: `javascript:${encodeURIComponent(code)}`
      });
      console.log(`- Script "${scriptPath}" found. Added to bookmarklets.`);
    } catch (e) {
      console.log(`- Error with script "${scriptPath}". Skipping dir for bookmarklets. Reason: ${e}`);
    }
  }
  
  return items;
};
