/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html",
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif']
    },
    extend: {
      width: {
        main: '1220px',
      },
      backgroundColor: {
        main: '#ee3131',
      },
      colors: {
        main: '#ee3131',
      },
      keyframes: {
        slidetop: {
          '0%': {
            '-webkit-transform': 'translateY(40px)',
            transform: 'translateY(20px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            transform: 'translateY(0px)'
          }
        }
      },
      animations: {
        wiggle: 'slidetop 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
      },
    },
  },
  plugins: [],
}