/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        // Polis brand scale (indigo → violet)
        polis: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c6ccff",
          300: "#a3a8ff",
          400: "#817bff",
          500: "#6c5cf6",
          600: "#5b4bf0",
          700: "#4c3ad6",
          800: "#3f31ad",
          900: "#372e88",
        },
        ink: {
          950: "#08070f",
          900: "#0c0b16",
          800: "#13111f",
          700: "#1b1930",
          600: "#272443",
          500: "#3a3660",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6c5cf6 0%, #a855f7 50%, #ec4899 100%)",
        "grid-faint":
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(108,92,246,0.25), 0 20px 60px -20px rgba(108,92,246,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -30px rgba(0,0,0,0.9)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)", opacity: "0.7" },
          "50%": { transform: "translate(4%,-4%) scale(1.15)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(108,92,246,0.5)" },
          "70%": { boxShadow: "0 0 0 12px rgba(108,92,246,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(108,92,246,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
        aurora: "aurora 14s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
