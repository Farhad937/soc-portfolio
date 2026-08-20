import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0e14",
          surface: "#10151d",
          raised: "#161c26",
        },
        border: {
          DEFAULT: "#1c2530",
          strong: "#293445",
        },
        text: {
          DEFAULT: "#e6e9ef",
          muted: "#8b95a7",
          faint: "#5b6577",
        },
        accent: {
          DEFAULT: "#4f8cff",
          dim: "#2f5cc4",
          bright: "#7cabff",
        },
        trace: "#22d3ee",
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
