/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#10b981', dark: '#059669', light: '#d1fae5' },
        eco: { dark: '#064e3b', bg: '#ecfdf5' },
        accent: '#f59e0b',
      },
      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
    },
  },
  plugins: [],
};
