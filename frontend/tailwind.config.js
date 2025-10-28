/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        card: "#1e2539",
        accent: "#38bdf8",
      },
    },
  },
  plugins: [],
}
