/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#0F172A",
        muted: "#F1F5F9",
        "muted-foreground": "#64748B",
        accent: "#0052FF",
        "accent-secondary": "#4D7CFF",
        "accent-foreground": "#FFFFFF",
        border: "#E2E8F0",
        card: "#FFFFFF",
        ring: "#0052FF",
      },
      fontFamily: {
        display: ["Calistoga", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        accent: "0 4px 14px rgba(0, 82, 255, 0.25)",
        "accent-lg": "0 8px 24px rgba(0, 82, 255, 0.35)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.3)",
            opacity: "0.7",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        marquee: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
}
