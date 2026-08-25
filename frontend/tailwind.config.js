/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      '#FF5A1F',
          'orange-soft':'#FFF0EA',
          blue:        '#2563EB',
          'blue-soft': '#EFF6FF',
          gray:        '#6B6B6B',
          border:      '#E8E8E8',
          light:       '#F7F7F7',
          dark:        '#111111',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Arial Narrow', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 8px 25px rgba(0,0,0,0.10)',
        orange:      '0 4px 20px rgba(255,90,31,0.25)',
      },
    },
  },
  plugins: [],
}
