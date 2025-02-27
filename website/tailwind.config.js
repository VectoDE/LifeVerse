/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Dark mode is enabled via 'class'
  theme: {
    extend: {
      colors: {
        // Colors for Light Mode
        lightBackground: '#f9fafb', // Light background
        lightText: '#1a202c', // Dark text color

        // Colors for Dark Mode
        darkBackground: '#1a202c', // Dark background
        darkText: '#e2e8f0', // Light text color

        // Additional color extensions
        primary: '#4CAF50', // Example for a primary color
        secondary: '#FF5722', // Example for a secondary color
        accent: '#FFC107', // Accent color
      },
      animation: {
        spinSlow: 'spin 20s infinite linear', // Slow spin animation
        fadeIn: 'fadeIn 1s ease-in', // Fade-in animation
        slideIn: 'slideIn 0.5s ease-out', // Slide-in animation
        bounce: 'bounce 1s infinite', // Bounce animation
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example for a sans-serif font
        serif: ['Georgia', 'serif'], // Example for a serif font
      },
      spacing: {
        '128': '32rem', // Example for custom spacing
        '144': '36rem',
      },
      boxShadow: {
        default: '0 2px 4px rgba(0, 0, 0, 0.1)', // Default shadow
        md: '0 4px 6px rgba(0, 0, 0, 0.1)', // Medium shadow
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)', // Large shadow
      },
    },
  },
  plugins: [],
}
