/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // src 디렉토리 안에 js/ts/tsx 파일 전부
  ],
  theme: {
    extend: {
      fontFamily: {
        cafe: ["Cafe24Ohsquare"],
        aggro: ["SBAggroB"],
        jamsil: ["TheJamsil5Bold"],
        hs: ["HS-Regular"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
