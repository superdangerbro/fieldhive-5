module.exports = function(api) {
  api.cache(true);
  
  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current',
        },
      }],
      '@babel/preset-typescript',
      '@babel/preset-react',
      'module:metro-react-native-babel-preset',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@mobile': './mobile/src',
          '@web': './web/src',
          '@shared': './shared',
          '@schemas': './shared/schemas',
          '@services': './shared/services',
          '@utils': './shared/utils',
          '@tests': './shared/schemas/tests',
        },
      }],
      isTest && ['babel-plugin-transform-import-meta', {
        module: 'ES6',
      }],
    ].filter(Boolean),
  };
};
