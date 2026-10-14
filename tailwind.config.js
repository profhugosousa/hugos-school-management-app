/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Space Indigo Palette
        'space-indigo': {
          50: '#edf0f7',
          100: '#dbe1f0',
          200: '#b8c2e0',
          300: '#94a4d1',
          400: '#7086c2',
          500: '#4d68b3',
          600: '#3d538f',
          700: '#2e3e6b',
          800: '#1f2947',
          900: '#0f1524',
          950: '#0b0f19',
        },
        // Dust Grey Palette
        'dust-grey': {
          50: '#f1f3f3',
          100: '#e4e7e6',
          200: '#c8d0ce',
          300: '#adb8b5',
          400: '#92a09c',
          500: '#778883',
          600: '#5f6d69',
          700: '#47524f',
          800: '#2f3735',
          900: '#181b1a',
          950: '#111312',
        },
        // Saddle Brown Palette
        'saddle-brown': {
          50: '#f9f1eb',
          100: '#f4e3d7',
          200: '#e8c6b0',
          300: '#ddaa88',
          400: '#d18e61',
          500: '#c67139',
          600: '#9e5b2e',
          700: '#774422',
          800: '#4f2d17',
          900: '#28170b',
          950: '#1c1008',
        },
        // Chocolate Palette
        'chocolate': {
          50: '#fbf0e9',
          100: '#f8e1d3',
          200: '#f1c3a7',
          300: '#eaa67b',
          400: '#e28850',
          500: '#db6a24',
          600: '#af551d',
          700: '#844015',
          800: '#582a0e',
          900: '#2c1507',
          950: '#1f0f05',
        },

        // Semantic Variables with Alpha/Opacity Support
        main: 'rgb(var(--rgb-bg-main) / <alpha-value>)',
        sidebar: 'rgb(var(--rgb-bg-sidebar) / <alpha-value>)',
        header: 'rgb(var(--rgb-bg-header) / <alpha-value>)',
        content: 'rgb(var(--rgb-text-content) / <alpha-value>)',
        'sidebar-content': 'rgb(var(--rgb-sidebar-text) / <alpha-value>)',
        muted: 'rgb(var(--rgb-text-muted) / <alpha-value>)',
        line: 'rgb(var(--rgb-border-line) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}