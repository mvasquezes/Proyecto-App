module.exports = function (api) {
  // guarda la config en cache para no recalcularla en cada archivo
  api.cache(true);
  return {
    presets: [
      // preset de expo, el jsxImportSource de nativewind es lo que hace funcionar los className
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // transforma las clases de tailwind en estilos de react native
      "nativewind/babel",
    ],
  };
};
