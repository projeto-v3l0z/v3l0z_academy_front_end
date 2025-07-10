const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
});
