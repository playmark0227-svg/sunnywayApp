import type { Config } from "tailwindcss";

// 株式会社Sunnyway 公式サイトのブランドに合わせたトークン
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFAF3",   // クリーム地
        surface: "#FFFFFF",
        ink: "#1A1A2E",       // ダークインク（やや紺寄り）
        muted: "#5A5A6E",     // 補助テキスト
        line: "#EFE6DA",      // ヘアライン
        coral: "#FF6B7D",
        pink: "#FFB6C8",
        leaf: "#7CB342",
        // ブランド・オレンジ（#F26B1F 基準）
        sunny: {
          50: "#FFF4E8", 100: "#FFE6CC", 200: "#FCCB98", 300: "#F9AE66",
          400: "#F58B3A", 500: "#F26B1F", 600: "#DC5511", 700: "#B5430F",
          800: "#8F3613", 900: "#742E13",
        },
      },
      fontFamily: {
        sans: ['var(--font-noto)', "system-ui", "-apple-system", "sans-serif"],
        display: ['var(--font-display)', "var(--font-noto)", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(116,46,19,.05), 0 6px 22px -8px rgba(116,46,19,.10)",
        card: "0 2px 8px rgba(116,46,19,.06), 0 18px 44px -16px rgba(116,46,19,.18)",
        lift: "0 4px 14px -4px rgba(242,107,31,.45), 0 14px 36px -10px rgba(242,107,31,.30)",
        glow: "0 10px 36px -10px rgba(242,107,31,.45), 0 2px 10px -2px rgba(255,107,125,.35)",
      },
      backgroundImage: {
        sunrise: "linear-gradient(135deg,#F26B1F 0%,#F8704A 50%,#FF6B7D 100%)",
        "sunrise-soft": "linear-gradient(135deg,#FFF3E6 0%,#FFE6EC 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
