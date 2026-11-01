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
        background: "#0c0d0e",
        surface: "#141517",
        surfaceElevated: "#1b1c1f",
        borderDark: "#26272b",
        cream: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#eae2d5",
          300: "#ded2bf",
          400: "#c8a97e",
          500: "#b59364",
        },
        stoneMuted: "#8e8d8a",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        atelier: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
