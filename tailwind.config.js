/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.tsx', './styles/**/*.css'],
  theme: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-nord')
  ],
}
