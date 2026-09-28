/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Theme Color Palette (Monochromatic Minimalism)
        dark: {
          bg: '#121212',        // Charcoal Black
          primary: '#E0E0E0',   // Light Gray
          secondary: '#B0B0B0', // Medium Gray
          border: '#444444',    // Dark Gray
          accent: '#888888',    // Soft Gray
        },
        // Inverted Light Theme Color Palette
        light: {
          bg: '#E0E0E0',        // Inverted Charcoal Black
          primary: '#121212',   // Inverted Light Gray
          secondary: '#444444', // Inverted Medium Gray
          border: '#B0B0B0',    // Inverted Dark Gray
          accent: '#888888',    // Soft Gray
        },
      },
    },
  },
  plugins: [],
}
