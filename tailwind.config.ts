import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F0E8",
          50: "#FAF8F4",
          100: "#F5F0E8",
          200: "#E8E1D5",
          300: "#D6CDB",
        },
        ink: {
          DEFAULT: "#191919",
          light: "#3D3833",
          muted: "#70695E",
        },
        tawny: {
          DEFAULT: "#C4704B",
          light: "#F0E6DF",
          hover: "#A85D3D",
        },
        // Keep sand/charcoal as aliases for backward compat during transition
        sand: {
          50: "#FAF8F4",
          100: "#F5F0E8",
          200: "#E8E1D5",
          300: "#D6CDB",
        },
        charcoal: {
          DEFAULT: "#191919",
          light: "#3D3833",
          muted: "#70695E",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
