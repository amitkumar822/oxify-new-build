const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  unstable_disableLightningCss: true, // critical
};

config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts.filter((ext) => ext !== "svg"), "node"],
  sourceExts: [...config.resolver.sourceExts, "svg", "cjs"],
};

// Disable LightningCSS here too
module.exports = withNativeWind(config, {
  input: "./global.css",
  disableLightningCss: true,
});
