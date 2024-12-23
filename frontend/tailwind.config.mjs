/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7FB800',
        secondary: '#466600',
        background: '#141414',
        background_secondary: '#0A0A0A',
        card: '#1F2937',
        text: '#FCF7FF',
        textSecondary: "#A8A8A8",
        error: '#FF4D4F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        muted: '#2D2D2D', 
      },
    },
  },
  plugins: [],
};
