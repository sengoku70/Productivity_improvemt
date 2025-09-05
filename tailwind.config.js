/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{jsx,ts,tsx}', './components/**/*.{jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
