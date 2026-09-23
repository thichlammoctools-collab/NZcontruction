import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e2229",
          dark: "#080c12",
          light: "#2b3340",
        },
        secondary: {
          DEFAULT: "#3b4a3f",
          dark: "#1e2820",
          light: "#536256",
        },
        bronze: {
          DEFAULT: "#b6824a",
          dark: "#986835",
          light: "#d4a066",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          white: "#ffffff",
          stone: "#f1f5f9",
          container: "#e7eeff",
          "container-high": "#dee8ff",
        },
        border: {
          light: "#e2e8f0",
          dark: "#334155",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
