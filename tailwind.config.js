/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05060a',
          900: '#0b0d14',
          800: '#121625',
          700: '#1a2036',
        },
        sand: {
          50: '#fbfaf9',
          100: '#f5f2ee',
          200: '#ebe3dc',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
}

