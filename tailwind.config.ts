import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF5EF",
        surface: "#FFFFFF",
        ink: "#241E1A",
        muted: "#9C9188",
        line: "#ECE4DA",
        gold: "#E7A24A",
        sunny: {
          50: "#FDEFEA", 100: "#FBDDD2", 200: "#F6BFA9", 300: "#F09A7C",
          400: "#EE7553", 500: "#EC5A36", 600: "#D8451F", 700: "#B23819",
          800: "#8B2E17", 900: "#6F2815",
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Zen Kaku Gothic New"', "system-ui", "sans-serif"],
        display: ['var(--font-display)', '"Shippori Mincho"', "serif"],
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

export default config;
