/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: '0px 2px 4px -2px rgba(0,0,0,0.06), 0px 4px 6px -1px rgba(0,0,0,0.1)',
      },
      
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
            transform: "translateX(-100%)",
          },
          "100%": {
            backgroundPosition: "200% 0",
            transform: "translateX(100%)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          /* IE and Edge */
          "-ms-overflow-style": "none !important",
          /* Firefox */
          "scrollbar-width": "none !important",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none !important",
          },
        },
      });
    },
  ],
  safelist: [
    "boxShadow",
    "shadow-card",
  //   "hover:bg-primary-500/90", 
  //  {
  //   pattern: /(bg|hover:bg|text|border)-(primary|secondary)-(50|100|200|300|400|500|600|700|800|900)(\/[0-9]{2})?/,
  // }
  ],
};
