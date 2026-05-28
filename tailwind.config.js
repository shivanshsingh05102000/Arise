/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
