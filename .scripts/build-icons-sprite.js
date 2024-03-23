/* TODO: Refactor later :) */

const path = require('path');
const fs = require('fs/promises');
const { parse, stringify } = require('svgson');

const DIST_PATH = './dist/assets/img/icons.svg';
const ICONS = [
  'github',
  'bookmark-multiple',
  'open-in-new',
  'bookmark',
  'block-helper',
  'check-bold',
  'bookmark-outline',
  'cog',
];

(async () => {
  const defs = [];

  for (const iconName of ICONS) {
    const iconPath = path.resolve('node_modules/@mdi/svg/svg/' + iconName + '.svg');
    const contents = await fs.readFile(iconPath, { encoding: 'utf8' });
    const symbol = await parse(contents);

    symbol.name = 'symbol';
    delete symbol.attributes.xmlns;

    defs.push(symbol);
  }

  const sprite = {
    name: 'svg',
    type: 'element',
    value: '',
    attributes: {
      'aria-hidden': 'true',
      version: '1.1',
      style: 'display:none;',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    parent: null,
    children: [
      {
        name: 'defs',
        type: 'element', 
        value: '',
        attributes: {},
        parent: null,
        children: defs,
      }
    ],
  };

  const spriteString = '<?xml version="1.0" encoding="utf-8"?>\n' + stringify(sprite);
  const spritePath = path.resolve(DIST_PATH);

  await fs.mkdir(path.dirname(spritePath), { recursive: true });
  await fs.writeFile(spritePath, spriteString, {
    encoding: 'utf8',
    flag: 'w',
  });
})();
