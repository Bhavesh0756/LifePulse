/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D7193F",
          crimson: "#A80F2D",
          navy: "#081B3A",
          slate: "#243B53",
          bg: "#F7F9FC",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(8, 27, 58, 0.06), 0 2px 6px -1px rgba(8, 27, 58, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(215, 25, 63, 0.12), 0 4px 12px -2px rgba(8, 27, 58, 0.08)',
        'crimson-glow': '0 8px 24px -4px rgba(215, 25, 63, 0.35)',
      },
    },
  },
  plugins: [],
}
