const { createFilter } = require("rollup-pluginutils");

const stringPlugin = function stringPlugin (opts = {}) {
  if (!opts.include) {
    throw Error("include option should be specified");
  }

  const filter = createFilter(opts.include, opts.exclude);

  if (!Array.isArray(opts.transformers)) {
    opts.transformers = null;
  }

  return {
    name: "string",

    transform(code, id) {
      if (filter(id)) {
        if (opts.transformers) {
          for (const transform of opts.transformers) {
            code = transform(code, id);
          }
        }

        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" }
        };
      }
    }
  };
};

exports.stringPlugin = stringPlugin;
