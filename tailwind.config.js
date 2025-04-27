/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat-alternates)", "sans-serif"],
        montserrat: ["var(--font-montserrat-alternates)", "sans-serif"],
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      const montserratComponents = {
        ".montserrat-alternates-thin": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "100",
          fontStyle: "normal",
        },
        ".montserrat-alternates-extralight": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "200",
          fontStyle: "normal",
        },
        ".montserrat-alternates-light": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "300",
          fontStyle: "normal",
        },
        ".montserrat-alternates-regular": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "400",
          fontStyle: "normal",
        },
        ".montserrat-alternates-medium": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "500",
          fontStyle: "normal",
        },
        ".montserrat-alternates-semibold": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "600",
          fontStyle: "normal",
        },
        ".montserrat-alternates-bold": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "700",
          fontStyle: "normal",
        },
        ".montserrat-alternates-extrabold": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "800",
          fontStyle: "normal",
        },
        ".montserrat-alternates-black": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "900",
          fontStyle: "normal",
        },
        ".montserrat-alternates-thin-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "100",
          fontStyle: "italic",
        },
        ".montserrat-alternates-extralight-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "200",
          fontStyle: "italic",
        },
        ".montserrat-alternates-light-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "300",
          fontStyle: "italic",
        },
        ".montserrat-alternates-regular-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "400",
          fontStyle: "italic",
        },
        ".montserrat-alternates-medium-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "500",
          fontStyle: "italic",
        },
        ".montserrat-alternates-semibold-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "600",
          fontStyle: "italic",
        },
        ".montserrat-alternates-bold-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "700",
          fontStyle: "italic",
        },
        ".montserrat-alternates-extrabold-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "800",
          fontStyle: "italic",
        },
        ".montserrat-alternates-black-italic": {
          fontFamily: "var(--font-montserrat-alternates), sans-serif",
          fontWeight: "900",
          fontStyle: "italic",
        },
      };

      addComponents(montserratComponents);
    },
  ],
};
