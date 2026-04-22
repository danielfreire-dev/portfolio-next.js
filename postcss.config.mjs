/**
 * PostCSS configuration for the project.
 *
 * Extends the Tailwind CSS theme with a custom "fade-in-up" animation
 * and registers the `@tailwindcss/postcss` plugin for processing
 * Tailwind CSS v4 directives.
 */
const config = {
  theme: {
    extend: {
      // Custom fade-in-up animation for entrance effects
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      // Keyframes defining the fade-in-up animation
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  // Tailwind CSS v4 PostCSS plugin
  plugins: ["@tailwindcss/postcss"],
};

export default config;
