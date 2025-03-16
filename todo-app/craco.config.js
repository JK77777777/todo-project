// craco.config.js
module.exports = {
    jest: {
      configure: {
        // By default, CRA’s Jest ignores all node_modules for transformation.
        // We override that ignoring *except* for @bundled-es-modules/tough-cookie:
        transformIgnorePatterns: [
          '[/\\\\]node_modules[/\\\\](?!(@bundled-es-modules/tough-cookie)/).+\\.js$',
        ],
      },
    },
  };
  