const fs = require('fs/promises');
const path = require('path');
const { rollup } = require('rollup');
const terserPlugin = require('@rollup/plugin-terser');
const { string: stringPlugin } = require('rollup-plugin-string');

const getBookmarkletList = async function getBookmarkletList (dir) {
  const list = (await fs.readdir(dir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .map(dirent => dirent.name);

  return list;
};

const createBookmarkletURI = function createBookmarkletURI (code) {
  return `javascript:${encodeURIComponent(code)}`;
};

const generateBookmarklet = async function generateBookmarklet (bookmarkletEntryPath) {
  const bookmarkletDir = path.dirname(bookmarkletEntryPath);

  const bundle = await rollup({
    input: bookmarkletEntryPath,
    plugins: [
      stringPlugin({
        include: path.join(bookmarkletDir, '*'),
        exclude: [
          bookmarkletEntryPath,
          path.join(bookmarkletDir, 'index.md'),
          path.join(bookmarkletDir, '*.{js,gif,png,jpg,webp}'),
        ]
      }),
      terserPlugin()
    ]
  });

  const { output } = await bundle.generate({ format: 'iife' });
  const result = output?.[0];
  const code = String(result.code).trim();

  return {
    code,
    modules: result.moduleIds.filter(modId => modId !== bookmarkletEntryPath),
  }
};

const createAssetData = async function createAssetData (assetPath, name = '') {
  const assetScript = await fs.readFile(assetPath, 'utf8');

  return {
    name: name || path.basename(assetPath),
    content: assetScript,
    lang: path.extname(assetPath).replace(/^\.+/g, ''),
  };
}

module.exports = async function bookmarklets (configData) {
  const items = [];

  console.log('Generating bookmarklets');

  const contentDir = path.join(configData.eleventy.env.root, './src/bookmarklets');
  const directories = await getBookmarkletList(contentDir);

  for (const name of directories) {
    try {
      const dirPath = path.join(contentDir, name);
      const scriptPath = path.join(dirPath, `index.js`);
      const { code, modules } = await generateBookmarklet(scriptPath);
      const files = [
        await createAssetData(scriptPath, name),
        ...(await Promise.all(modules.map(async mod => await createAssetData(mod)))),
      ];

      items.push({
        name,
        files,
        bookmarkUrl: createBookmarkletURI(code)
      });
      console.log(`- Script "${name}" found. Added to bookmarklets.`);
    } catch (e) {
      console.log(`- Error with script "${name}". Skipping dir for bookmarklets. Reason: ${e}`);
    }
  }
  
  return items;
};
