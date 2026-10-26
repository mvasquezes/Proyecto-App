// config por defecto de metro (el empaquetador de expo)
const { getDefaultConfig } = require("expo/metro-config");
// funcion de nativewind que se engancha a metro
const { withNativeWind } = require('nativewind/metro');

// arma la config base de este proyecto
const config = getDefaultConfig(__dirname)

// le agrega nativewind y le dice que el css de entrada es global.css
module.exports = withNativeWind(config, { input: './global.css' })
