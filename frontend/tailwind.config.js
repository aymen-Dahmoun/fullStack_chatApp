/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  
  content: ["./App.js","./src/**/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}