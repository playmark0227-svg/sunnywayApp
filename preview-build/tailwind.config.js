/** プレビュー専用の Tailwind 設定。preview/index.html を走査して styles.css を生成する。 */
module.exports = {
  content: ["preview/index.html"],
  theme: {
    extend: {
      colors: {
        sunny: {
          50: "#fff8ed", 100: "#ffefd4", 200: "#ffdca8", 300: "#ffc170",
          400: "#ff9d37", 500: "#ff7f11", 600: "#f06306", 700: "#c74807",
          800: "#9e390e", 900: "#7f300f",
        },
      },
    },
  },
};
