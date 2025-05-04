/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#334155",
        background: "#ffffff",
        foreground: "#1e293b",
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          foreground: "#1f2937",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#4b5563",
          foreground: "#ffffff",
        },
        // Custom colors
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        slate: {
          950: "#0f172a",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
