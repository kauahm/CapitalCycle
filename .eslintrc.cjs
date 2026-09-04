module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
  },
  overrides: [
    {
      // A cena 3D usa os elementos intrínsecos do react-three-fiber
      // (<mesh>, <instancedMesh>, <planeGeometry>...). O plugin do React
      // só conhece as tags do DOM, então acusa cada prop do three.js como
      // atributo desconhecido. A regra é desligada só aqui.
      files: ['src/components/home/hero/CycleScene.jsx'],
      rules: { 'react/no-unknown-property': 'off' },
    },
  ],
};
