const { environment } = require("@rails/webpacker");
const { InjectManifest } = require("workbox-webpack-plugin");

// Get a pre-configured plugin
const manifestPlugin = environment.plugins.get("Manifest");
manifestPlugin.options.writeToFileEmit = false;

environment.plugins.prepend(
  "GenerateSW",
  new InjectManifest({
    maximumFileSizeToCacheInBytes: 4194304,
    swSrc: "sw.js",
    swDest: "../sw.js",
  })
);

module.exports = environment;
