/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmadark: "#0A2647",
        pharmablue: "#2C7BE5",
        pharmasucc: "#10B981",
        pharmadanger: "#EF4444",
        pharmawarn: "#F59E0B",
        pharmabg: "#F8FAFC"
      }
    },
  },
  plugins: [],
}
