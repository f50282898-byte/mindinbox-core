import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#050505",
          light: "#111111",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          dark: "#997E22",
        },
        cyan: {
          glowing: "rgba(0, 255, 255, 0.6)",
        },
        background: "#050505",
        foreground: "#F3E5AB", // Light gold for text
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        amiri: ["var(--font-amiri)", "serif"],
      },
      backgroundImage: {
        "obsidian-gradient": "linear-gradient(180deg, #050505 0%, #111111 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
