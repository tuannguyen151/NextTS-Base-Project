/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-base)', ...fontFamily.sans]
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    colors: {
      white: colors.white,
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      background: '#F9F5EB',
      color: '#002B5B',
      button: '#EA5455',
      hover: '#E4DCCF'
    }
  },
  plugins: []
}
