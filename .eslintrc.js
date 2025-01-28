module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  env: {
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'object-shorthand': ['error', 'always'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-return-await': 'error',
    'require-await': 'error'
  },
  overrides: [
    // Mobile app specific rules
    {
      files: ['mobile/src/**/*.{js,jsx}'],
      extends: [
        'universe/native',
        'plugin:react-hooks/recommended'
      ],
      env: {
        'react-native/react-native': true
      },
      rules: {
        'react/prop-types': 'off',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-raw-text': ['warn', { skip: ['Text'] }],
        'react-native/no-unused-styles': 'warn',
        'react-native/split-platform-components': 'warn'
      }
    },
    // Web app specific rules
    {
      files: ['web/src/**/*.{js,jsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      env: {
        browser: true
      },
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/anchor-is-valid': 'warn'
      }
    },
    // Shared code rules
    {
      files: ['shared/**/*.js'],
      env: {
        node: true,
        browser: true
      },
      rules: {
        'no-restricted-globals': 'off'
      }
    },
    // Test files
    {
      files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
