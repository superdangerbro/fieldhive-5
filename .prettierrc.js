module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // JSX specific
  jsxBracketSameLine: false,

  // Object/Array
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',

  // Overrides for specific file types
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.{css,scss}',
      options: {
        parser: 'css',
        singleQuote: false,
      },
    },
    {
      files: '*.{md,mdx}',
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        parser: 'yaml',
        singleQuote: false,
      },
    },
    // Mobile specific
    {
      files: 'mobile/src/**/*.{js,jsx}',
      options: {
        printWidth: 90, // Slightly shorter for mobile
      },
    },
    // Web specific
    {
      files: 'web/src/**/*.{js,jsx}',
      options: {
        printWidth: 100,
      },
    },
    // Shared code
    {
      files: 'shared/**/*.js',
      options: {
        printWidth: 100,
      },
    },
  ],
};
