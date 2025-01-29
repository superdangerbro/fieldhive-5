module.exports = {
  // Mobile app files
  'mobile/src/**/*.{js,jsx,ts,tsx}': [
    'cd mobile && eslint --fix',
    'cd mobile && prettier --write'
  ],
  'mobile/src/**/*.{json,css,scss,md}': [
    'cd mobile && prettier --write'
  ],

  // Web app files
  'web/src/**/*.{js,jsx,ts,tsx}': [
    'cd web && eslint --fix',
    'cd web && prettier --write'
  ],
  'web/src/**/*.{json,css,scss,md}': [
    'cd web && prettier --write'
  ],

  // Shared files
  'shared/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  'shared/**/*.{json,css,scss,md}': [
    'prettier --write'
  ],

  // Root level files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{json,css,scss,md}': [
    'prettier --write'
  ]
};
