/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F0",
        coral: "#FFB7B2",
        peach: "#FFDAC1",
        mint: "#B5EAD7",
        lavender: "#C7CEEA",
        charcoal: "#2D2D3A",
      },
      fontFamily: {
        outfit: ["Outfit_400Regular", "Outfit_700Bold"],
        dmsans: ["DMSans_400Regular", "DMSans_700Bold"],
      },
    },
  },
  plugins: [],
}
