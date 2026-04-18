/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mill-green': '#1b4332',
        'mill-gold': '#d4a574',
        'mill-cream': '#fdfbf7',
        'secondary-red': '#e63946',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      }
    },
  },
  plugins: [],
}
