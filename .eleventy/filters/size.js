const prettyBytes = require('pretty-bytes');

module.exports = {
  name: 'size',
  filter (size) {
    return prettyBytes(size);
  }
};
