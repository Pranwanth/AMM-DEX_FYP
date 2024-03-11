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
      }
    },
  },
  plugins: [],
}

