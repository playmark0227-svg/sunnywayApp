import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sunnyway ブランドカラー（陽だまりのオレンジ〜イエロー）
        sunny: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdca8",
          300: "#ffc170",
          400: "#ff9d37",
          500: "#ff7f11",
          600: "#f06306",
          700: "#c74807",
          800: "#9e390e",
          900: "#7f300f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
