/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',
        secondary: '#FFA500',
        accent: '#4ECDC4',
        light: '#F7F7F7',
        dark: '#333333'
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      borderRadius: {
        lg: '12px'
      }
    },
  },
  plugins: [],
}
