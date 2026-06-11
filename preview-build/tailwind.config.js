/** プレビュー専用 Tailwind 設定 — 株式会社Sunnyway 公式ブランドに準拠 */
module.exports = {
  content: ["preview/index.html", "preview/admin.html", "preview/app.js", "preview/admin.js", "preview/common.js"],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFAF3",
        surface: "#FFFFFF",
        ink: "#1A1A2E",
        muted: "#5A5A6E",
        line: "#EFE6DA",
        coral: "#FF6B7D",
        pink: "#FFB6C8",
        leaf: "#7CB342",
        sunny: {
          50: "#FFF4E8", 100: "#FFE6CC", 200: "#FCCB98", 300: "#F9AE66",
          400: "#F58B3A", 500: "#F26B1F", 600: "#DC5511", 700: "#B5430F",
          800: "#8F3613", 900: "#742E13",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "system-ui", "sans-serif"],
        display: ['Montserrat', '"Noto Sans JP"', "sans-serif"],
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
};
