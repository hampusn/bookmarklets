module.exports = {
  name: 'templateBodyClass',
  filter (template) {
    const tpl = String(template)
      .toLowerCase()
      .replace(/(\..*)$/, '')
      .replace(/([^a-z0-9]+)/g, '-');

    return `template-${tpl}`;
  },
};
