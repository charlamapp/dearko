import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas:  "#FFFFFF",
        alt:     "#F5F5F5",
        ink:     "#2C2B2B",
        muted:   "#6B6868",
        line:    "#E8E8E8",
        sky:     "#5CADD4",
        btn:     "#3D3B38",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        wrap: "80rem",
      },
    },
  },
  plugins: [],
};
export default config;
