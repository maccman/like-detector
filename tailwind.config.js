// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },

      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'bounce-in': 'bounce-in 800ms normal forwards ease-in-out',
      },

      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },

        'bounce-in': {
          '0%': { opacity: 0, transform: 'scale(.8)' },
          '50%': { opacity: 1, transform: 'scale(1.4)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        }
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
