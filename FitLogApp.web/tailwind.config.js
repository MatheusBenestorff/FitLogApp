/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#001f3d",
          800: "#002a52",
        },
        brand: {
          orange: "#e15905",
        },
      },
    },
  },
  plugins: [],
};
