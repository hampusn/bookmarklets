module.exports = {
  name: 'debug',
  filter (obj) {
    return `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`;
  }
};
