/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding your custom AakaA colors here
        aakaa: {
          green: '#1E4D36',
          cream: '#F8F7F3',
          gold: '#9C9E8E',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}