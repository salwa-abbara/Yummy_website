/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        rotation: {
          '0%': {  transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
    
       
    },
    screens: {
      'xs': {'max':'575px'},
      'sm':'576px',
      'md': '768px',
      'lg': '992px',
      'xl':'1200px',
      '2xl':'1400px',
    },
    container: {
      maxWidth: {
        'xs': '100%',
        'sm': '540px',
        'md': '720px',
        'lg': '960px',
        'xl': '1140px',
       '2xl': '1320px',
      },
      center: true,
      
    },
  },
  plugins: [],
}

