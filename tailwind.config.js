/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-image": "url('/background.png')",
      },
      backgroundColor: {
        primary: "#25303D",
        "primary-light": "#6BE06B",
        "primary-dark": "#328532",
        secondary: "#29A08A",
        "secondary-light": "#FFD13F",
        "secondary-dark": "#C68C00",
        accent: "#C2DEF6",
        "accent-light": "#FF6B6B",
        "accent-dark": "#B02630",
        background: "#F0F8FF",
      },
      textColor: {
        primary: "#4CAE4C",
        "primary-light": "#6BE06B",
        "primary-dark": "#328532",
        secondary: "#FFB800",
        "secondary-light": "#FFD13F",
        "secondary-dark": "#C68C00",
        accent: "#E53A40",
        "accent-light": "#FF6B6B",
        "accent-dark": "#B02630",
      },
    },
  },
  plugins: [],
};
