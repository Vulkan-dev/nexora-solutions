import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0d",
        surface: "#111216",
        surfaceElevated: "#181920",
        surfaceCard: "#14151b",
        borderDark: "#22232a",
        cream: {
          50: "#faf8f5",
          100: "#f6f2ea",
          200: "#eae2d5",
          300: "#dfd3bf",
          400: "#cbb493",
          500: "#b99a6c",
        },
        gold: {
          light: "#ebd7be",
          DEFAULT: "#c5a880",
          dark: "#9e825a",
        },
      },
      boxShadow: {
        atelier: "0 20px 45px -15px rgba(0, 0, 0, 0.8)",
        glow: "0 0 25px rgba(203, 180, 147, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
