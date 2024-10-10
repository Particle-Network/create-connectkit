const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    zlib: require.resolve('browserify-zlib'),
    url: false,
  };

  config.resolve.alias['@'] = path.resolve('src');

  config.plugins.unshift(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Support CJS file
  // https://github.com/facebook/create-react-app/pull/12021
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [/\.(js|mjs|jsx|cjs|ts|tsx)$/, /\.html$/, /\.json$/];
    }

    return rule;
  });
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];
  return config;
};
