// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Look for Tailwind classes in all JS, JSX, TS, TSX files inside the src folder
    "./public/index.html",       // Also check your public HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}