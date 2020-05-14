const railsWebpackEnv = require("../config/webpack/environment");

module.exports = {
  stories: ["../app/javascript/stories/*.jsx"],
  webpackFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      ...railsWebpackEnv.config.resolve,
      modules: railsWebpackEnv.resolvedModules.map((i) => i.value),
    },
    module: {
      ...config.module,
      rules: railsWebpackEnv.loaders
        .filter((i) => i.key !== "nodeModules")
        .map((i) => i.value),
    },
    plugins: [
      ...config.plugins,
      ...railsWebpackEnv.plugins.map((i) => i.value),
    ],
  }),
  addons: [
    "@storybook/addon-knobs/register",
    "@storybook/addon-actions/register",
  ],
};
