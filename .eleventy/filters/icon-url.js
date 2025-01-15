const process = require('process');
const project = require('../../package.json');
const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  name: 'iconUrl',
  filter (iconId) {
    const v = IS_DEV ? +new Date() : project.version;

    return `/assets/img/icons.svg?v=${v}#${iconId}`;
  }
};
