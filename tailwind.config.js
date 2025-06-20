/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background : '#F0F0F0',
        'main' : '#F1815C',
        'accent' : '#FF7849',
        'tab-inactive' : '#777777',
        'active' : '#FF3F00',
        grey: '#D9D9D9',
        'card' : '#F4F4F4',
        'login' : '#FFF7E8'
      },
      fontWeight : {
        semibold: 600,
        bold: 700,
        extrabold: 800,
        medium: 500,
        normal: 400
      },
      borderRadius: {
        xl: '12px',
        '2xl' : '16px',
        '3xl' : '24px',
        '4xl':'32px',
        20 : '20px',
      },
      boxShadow: {
        shadow: '0 4px 6px rgb(32 33 36 / 28%)'
      },
      fontSize: {
        base : '16px',
        lg : '18px',
        '2xl' : '24px',
        '4xl' : '36px',
        '6xl' : '60px',
      },
      spacing: {
        container: '1190px',
        sectionHeight: '1080px'
      },
      borderWeight: {
        DEFAULT: '1px',
        'active': '10px',
        3 : '3px'
      },
      screens: {
        'sm' : '640px',
        'md' : '768px',
        'lg' : '1024px',
        'xl' : '1280px'
      }
    },
  },
  plugins: []
}

