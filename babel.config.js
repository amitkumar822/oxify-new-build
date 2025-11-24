module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind", useLightningcss: false }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./components",
            "@config": "./config",
            "@hooks": "./hooks",
            "@navigation": "./navigation",
            "@utils": "./utils",
            "@screens": "./screens",
            "@helpers": "./helpers",
            "@assets": "./assets/*",
          },
        },
      ],
      // only if you use Reanimated
      "react-native-reanimated/plugin",
    ],
  };
};