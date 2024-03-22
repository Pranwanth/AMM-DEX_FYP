/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '128': '32rem',
      },
      inset: {
        '5%': '5%',
        '40%': '40%',
        '45%': '45%',
        '-50%': '-50%',
      },
      colors: {
        primaryBackground: '#F7F7F7',
        secondaryBackground: '#E1E1E1',
        primaryText: '#333333',
        secondaryText: '#555555',
        interactiveElements: '#0F609B',
        highlight: '#BEE3F8',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

