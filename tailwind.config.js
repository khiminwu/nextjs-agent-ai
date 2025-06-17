/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // App Router paths
    './components/**/*.{js,ts,jsx,tsx}', // If you use components
    './pages/**/*.{js,ts,jsx,tsx}', 
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        surface: '#1e293b',
        card: '#334155',
        text: '#f1f5f9',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadein: 'fadein 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}