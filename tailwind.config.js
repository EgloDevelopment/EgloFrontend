/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/theme";

export default {
  content: [
    "./index.html",
    "./components/*",
    "./src/**/*",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
