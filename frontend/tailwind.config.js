/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        128: "32rem",
      },
      inset: {
        "5%": "5%",
        "37%": "37%",
        "40%": "40%",
        "45%": "45%",
        "43%": "43%",
        "-50%": "-50%",
      },
      colors: {
        primaryBackground: "#ebf0f3",
        secondaryBackground: "#DFDFDF",
        primaryText: "#333333",
        secondaryText: "#555555",
        interactiveElements: "#202020",
        highlight: "#007BFF",
        disabled: "#A1A1A1",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
