/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./components/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./screens/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
