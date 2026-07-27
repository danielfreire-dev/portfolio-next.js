/**
 * PostCSS configuration for the project.
 *
 * Registers the `@tailwindcss/postcss` plugin for processing
 * Tailwind CSS v4 directives. Theme customizations (animations,
 * colors, etc.) are defined in globals.css via `@theme` directives.
 */
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
