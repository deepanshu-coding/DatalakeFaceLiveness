const {getDefaultConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...defaultConfig.resolver.assetExts, 'bin', 'model']
  }
};
