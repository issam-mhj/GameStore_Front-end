// tailwind.config.js


import tailwindcss from "@tailwindcss/vite"
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss()
  ],
};
