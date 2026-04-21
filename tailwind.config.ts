import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Vinculamos las fuentes que pusimos en el Layout
        headline: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        'primary-unne': '#000666',
        'secondary-unne': '#7345b6',
        'surface-lavender': '#fbf8ff',
        'on-surface': '#1b1b21',
      },
    },
  },
  plugins: [],
};
export default config;