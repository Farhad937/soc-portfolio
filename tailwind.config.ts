import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a1220",
          surface: "#18263a",
          raised: "#233652",
        },
        border: {
          DEFAULT: "#314967",
          strong: "#4b6587",
        },
        text: {
          DEFAULT: "#edf2fa",
          muted: "#aebbd0",
          faint: "#7e8da4",
        },
        accent: {
          DEFAULT: "#4f8cff",
          dim: "#376fd6",
          bright: "#90b9ff",
        },
        trace: "#40e4ff",
        highlight: "#ffce1b",
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.45s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "progress-fill": "progressFill 0.7s ease-out forwards",
        "hero-kicker": "heroKicker 0.55s ease-out forwards",
        "hero-heading": "heroHeading 0.6s ease-out forwards",
        blink: "blink 2s step-start infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        progressFill: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        heroKicker: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroHeading: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
