// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-', // Add prefix to avoid conflicts with Once UI
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Add your custom theme extensions here
      colors: {
        'brand-primary': '#0166FF',
        'brand-secondary': '#00D4FF'
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};