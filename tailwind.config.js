/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "color-menu" : "#0F172A",
        "color-action" : "#10B981",
        "bg-color" : "#F8FAFC",
        "color-inactive": "#94A3B8",
        "color-card-home": "#1E293B",

        // colores bancos y formularios
        "bank-bancoestado": "#EA580C",
        "bank-falabella": "#15803D",
        "bank-santander": "#DC2626",
        "bank-mastercard": "#1E293B",
        "bank-visa": "#1E3A8A",
        "input-bg": "#F8FAFC",
        "input-border": "#CBD5E1",
    },
  },
  plugins: [],
}
}