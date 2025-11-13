/** @type {import('tailwindcss').Config} */
export default {
  // Content: Scans src for Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extend: Custom fade-in for animations (e.g., modals/fades)
      animation: {
        'fade-in': 'fade-in 0.3s ease-out', // for custom animation
      }
    },
  },
  plugins: [],
}

