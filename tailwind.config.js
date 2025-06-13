/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      screens: {
        '320': '320px',
        '1024': '1024px',
        '1440': '1440px'
      }
    },
  },
  plugins: []
}

