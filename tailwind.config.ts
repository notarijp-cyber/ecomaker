import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // COLORI BASE (Questi servono per evitare l'errore border-border)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // COLORI QUANTUM (Le nostre personalizzazioni)
        background: "#0f111a", // Nero Profondo
        foreground: "#ffffff",
        
        primary: {
          DEFAULT: "#06b6d4", // Cyan
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a855f7", // Purple
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#1e293b",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#1a1d2d",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#1a1d2d",
          foreground: "#ffffff",
        },
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        // BATTITO CARDIACO REALE
        "heartbeat": {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        // PULSAZIONE LENTA
        "pulse-slow": {
          '0%, 100%': { opacity: "1" },
          '50%': { opacity: "0.8" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "heartbeat": "heartbeat 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;