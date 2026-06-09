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
        soft: "0 1px 2px rgba(26,26,46,.04), 0 4px 16px rgba(26,26,46,.05)",
        card: "0 2px 6px rgba(26,26,46,.05), 0 12px 32px -12px rgba(26,26,46,.14)",
        lift: "0 8px 30px -8px rgba(242,107,31,.4)",
      },
      backgroundImage: {
        sunrise: "linear-gradient(135deg,#F26B1F 0%,#F8704A 50%,#FF6B7D 100%)",
        "sunrise-soft": "linear-gradient(135deg,#FFF3E6 0%,#FFE6EC 100%)",
      },
    },
  },
};
