/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'faesb-green': '#2D5A27', 
        'faesb-blue': '#1B365D',  
      }
    },
  },
  plugins: [],
}