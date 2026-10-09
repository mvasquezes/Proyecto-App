/** @type {import('tailwindcss').Config} */
module.exports = {
  // carpetas donde tailwind busca clases, si se crea otra carpeta con componentes hay que sumarla aca
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // preset de nativewind para que tailwind funcione en react native
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      // fuentes propias, se usan como font-inter-regular, font-inter-medium y font-inter-bold
      fontFamily: {
        'inter-regular':['Inter_400Regular', 'sans-serif'],
        'inter-medium':['Inter_500Medium', 'sans-serif'],
        'inter-bold':['Inter_700Bold', 'sans-serif'],
      },
      // colores propios, se usan como bg-color-action, text-color-menu, etc
      colors: {
        "color-menu" : "#0F172A",      // azul casi negro del menu y fondos oscuros
        "color-action" : "#10B981",    // verde de los botones
        "bg-color" : "#F8FAFC",        // gris muy claro del fondo
        "color-inactive": "#94A3B8",   // gris de los botones del menu que no estan activos
        "color-card-home": "#1E293B",  // gris oscuro para tarjetas

        // colores de cada banco (los mismos de constants/banks.ts) y de los formularios
        "bank-bancoestado": "#EA580C",
        "bank-falabella": "#15803D",
        "bank-santander": "#DC2626",
        "bank-mastercard": "#1E293B",
        "bank-visa": "#1E3A8A",
        "input-bg": "#F8FAFC",
        "input-border": "#CBD5E1",
    },
  },
  // ojo: este plugins quedo dentro de theme por una llave mal cerrada, como esta vacio no afecta
  plugins: [],
}
}
