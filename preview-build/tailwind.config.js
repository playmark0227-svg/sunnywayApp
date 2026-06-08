/** プレビュー専用 Tailwind 設定 — エディトリアルな高級コスメのデザインシステム */
module.exports = {
  content: ["preview/index.html", "preview/admin.html", "preview/app.js", "preview/admin.js", "preview/common.js"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF5EF",   // 温かいアイボリーの地
        surface: "#FFFFFF",
        ink: "#241E1A",       // 温黒（本文）
        muted: "#9C9188",     // 補助テキスト
        line: "#ECE4DA",      // ヘアライン
        gold: "#E7A24A",
        // ブランド（珊瑚〜サンライズ）
        sunny: {
          50: "#FDEFEA", 100: "#FBDDD2", 200: "#F6BFA9", 300: "#F09A7C",
          400: "#EE7553", 500: "#EC5A36", 600: "#D8451F", 700: "#B23819",
          800: "#8B2E17", 900: "#6F2815",
        },
      },
      fontFamily: {
        sans: ['"Zen Kaku Gothic New"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Shippori Mincho"', "serif"],
      },
      borderRadius: { xl2: "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(36,30,26,.04), 0 4px 16px rgba(36,30,26,.05)",
        card: "0 2px 6px rgba(36,30,26,.04), 0 12px 32px -12px rgba(36,30,26,.12)",
        lift: "0 8px 30px -8px rgba(236,90,54,.35)",
      },
      backgroundImage: {
        sunrise: "linear-gradient(135deg,#FF8A3D 0%,#F0506E 100%)",
        "sunrise-soft": "linear-gradient(135deg,#FDEFEA 0%,#FBE7EC 100%)",
      },
    },
  },
  plugins: [],
};
