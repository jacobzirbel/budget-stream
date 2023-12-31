module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'ignorePatterns': ['dist/', '*.js'],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    },
    {
      'files': ['./tests/**/*.test.ts'],
      'rules': {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    "no-restricted-globals": ["error", "event", "fdescribe", "console.log"],
    "no-constant-condition": ["error", { "checkLoops": false }],
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
  }
};
