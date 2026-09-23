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
          DEFAULT: "#080c12",
          dark: "#080c12",
          light: "#2b3340",
          container: "#1e2229",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#868992",
        "primary-container": "#1e2229",
        secondary: {
          DEFAULT: "#536256",
          dark: "#1e2820",
          light: "#536256",
          container: "#d3e4d5",
          fixed: "#d6e7d8",
          "fixed-dim": "#bacbbc",
        },
        "secondary-container": "#d3e4d5",
        "secondary-fixed": "#d6e7d8",
        "on-secondary-container": "#57665a",
        "on-secondary-fixed": "#101f15",
        bronze: {
          DEFAULT: "#b6824a",
          dark: "#986835",
          light: "#d4a066",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          bright: "#f9f9ff",
          dim: "#d0daf0",
          white: "#ffffff",
          stone: "#f1f5f9",
          container: "#e7eeff",
          "container-high": "#dee8ff",
          "container-highest": "#d9e3f9",
          "container-low": "#f0f3ff",
          "container-lowest": "#ffffff",
        },
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d9e3f9",
        "surface-container-low": "#f0f3ff",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#d0daf0",
        "surface-bright": "#f9f9ff",
        "on-surface": "#121c2c",
        "on-surface-variant": "#45474b",
        "inverse-surface": "#273141",
        "inverse-on-surface": "#ebf1ff",
        "outline-variant": "#c6c6cb",
        "tertiary-container": "#381a00",
        "on-tertiary-container": "#cf7100",
        border: {
          light: "#e2e8f0",
          dark: "#334155",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
