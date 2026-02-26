export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Noto Serif JP'", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "MS Mincho", "serif"],
        sans: ["'Noto Sans JP'", "Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Meiryo", "sans-serif"],
      },
    },
  },
  plugins: [],
}
