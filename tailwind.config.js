/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      $black: "#000",
      $white: "#fff",
      transparent: "transparent",
      current: "currentColor",

      foreground: "rgb(var(--foreground) / <alpha-value>)",
      background: "rgb(var(--background) / <alpha-value>)",

      "accents-1": "rgb(var(--accents-1) / <alpha-value>)",
      "accents-2": "rgb(var(--accents-2) / <alpha-value>)",
      "accents-3": "rgb(var(--accents-3) / <alpha-value>)",
      "accents-4": "rgb(var(--accents-4) / <alpha-value>)",
      "accents-5": "rgb(var(--accents-5) / <alpha-value>)",
      "accents-6": "rgb(var(--accents-6) / <alpha-value>)",
      "accents-7": "rgb(var(--accents-7) / <alpha-value>)",
      "accents-8": "rgb(var(--accents-8) / <alpha-value>)",

      "secondary-lighter": "rgb(var(--secondary-lighter) / <alpha-value>)",
      "secondary-light": "rgb(var(--secondary-light) / <alpha-value>)",
      secondary: "rgb(var(--secondary) / <alpha-value>)",
      "secondary-dark": "rgb(var(--secondary-dark) / <alpha-value>)",

      "success-lighter": "rgb(var(--success-lighter) / <alpha-value>)",
      "success-light": "rgb(var(--success-light) / <alpha-value>)",
      success: "rgb(var(--success) / <alpha-value>)",
      "success-dark": "rgb(var(--success-dark) / <alpha-value>)",

      "error-lighter": "rgb(var(--error-lighter) / <alpha-value>)",
      "error-light": "rgb(var(--error-light) / <alpha-value>)",
      error: "rgb(var(--error) / <alpha-value>)",
      "error-dark": "rgb(var(--error-dark) / <alpha-value>)",
    },

    borderRadius: {
      none: "0",
      base: "5px",
      marketing: "8px",
      full: "9999px",
    },

    scrollMargin: {
      input: "8rem",
    },

    extend: {},

    container: {
      screens: {
        DEFAULT: "100%",
        sm: "640px",
        med: "768px",
        lg: "1024",
        xl: "1024px",
        "2xl": "1024px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
  variants: {
    scrollbar: ["rounded"],
  },
}
