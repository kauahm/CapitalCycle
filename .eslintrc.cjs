module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  // `referencia/` e `docs/` guardam pranchas e bundles do Designer, não código
  // do produto: ficam fora do lint para o `npm run lint` refletir só o app.
  ignorePatterns: ['dist', '.eslintrc.cjs', 'referencia', 'docs', 'coverage'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', 'vitest.config.js', 'vitest.setup.js'],
      env: { node: true },
      globals: { describe: 'readonly', it: 'readonly', expect: 'readonly', vi: 'readonly', beforeEach: 'readonly', afterEach: 'readonly' },
    },
  ],
};
