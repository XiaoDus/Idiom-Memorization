/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zhuhong': '#C73E3A',
        'zhuise': '#2B2B2B',
        'xuanzhi': '#F8F6F1',
        'jinse': '#D4A84B',
        'mibai': '#FAFAF8',
      },
      fontFamily: {
        'song': ['"Source Serif 4"', 'serif'],
        'hei': ['"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
