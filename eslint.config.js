// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
// reglas de eslint que recomienda expo
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // no revisa la carpeta dist, que es la app ya compilada
    ignores: ['dist/*'],
  },
]);
