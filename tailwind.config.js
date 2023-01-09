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

      foreground: "var(--foreground)",
      background: "var(--background)",

      "accents-1": "var(--accents-1)",
      "accents-2": "var(--accents-2)",
      "accents-3": "var(--accents-3)",
      "accents-4": "var(--accents-4)",
      "accents-5": "var(--accents-5)",
      "accents-6": "var(--accents-6)",
      "accents-7": "var(--accents-7)",
      "accents-8": "var(--accents-8)",

      "secondary-lighter": "var(--secondary-lighter)",
      "secondary-light": "var(--secondary-light)",
      secondary: "var(--secondary)",
      "secondary-dark": "var(--secondary-dark)",

      "success-lighter": "var(--success-lighter)",
      "success-light": "var(--success-light)",
      success: "var(--success)",
      "success-dark": "var(--success-dark)",

      "error-lighter": "var(--error-lighter)",
      "error-light": "var(--error-light)",
      error: "var(--error)",
      "error-dark": "var(--error-dark)",
    },

    borderRadius: {
      none: "0",
      base: "5px",
      marketing: "8px",
    },

    extend: {},
  },
  plugins: [],
}
