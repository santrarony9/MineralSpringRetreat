/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          forest: '#1E2C22',
          forestDark: '#151F18',
          forestLight: '#2C3E31',
          sage: '#4A5D4E',
          cream: '#FAF7F2',
          creamLight: '#FFFFFF',
          creamDark: '#F2EDE4',
          sand: '#C5A880',
          sandDark: '#A4855C',
          sandLight: '#EFE8DC',
          charcoal: '#1F2220',
          muted: '#686E69',
          border: '#E6DFD5',
          borderDark: '#2D3B31',
        },
        wix: {
          bg: '#FAF7F2',
          yellow: '#C5A880',
          coral: '#1E2C22',
          pink: '#4A5D4E',
          olive: '#1E2C22',
          darkOlive: '#151F18',
          blue: '#2C3E31',
          dark: '#1F2220',
          charcoal: '#1F2220',
          gray: '#686E69',
          lightGray: '#8F8F8F',
          border: '#E6DFD5',
        }
      },
      fontFamily: {
        roman: [
          '"Manrope"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          '"Manrope"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        heading: [
          '"Manrope"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        display: [
          '"Manrope"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        sans: [
          '"Inter"',
          '"Manrope"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        body: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        nav: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        button: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
      },
      letterSpacing: {
        'cozy-wide': '0.22em',
        'cozy-widest': '0.3em',
      }
    },
  },
  plugins: [],
}
