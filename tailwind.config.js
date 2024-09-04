import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { top: "0px", opacity: 0 },
          "100%": { opacity: 1, top: "-120px" },
        },

        fadeOut: {
          "100%": { display: "none" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s forwards",
        fadeOut: "fadeOut 0.5s forwards",
      },
    },
  },
  plugins: [],
};
