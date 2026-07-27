/**
 * Loads environment variables from `.env` files for the Next.js project.
 *
 * This module is executed early to ensure all environment variables are
 * available before the application starts. It uses Next.js' built-in
 * `loadEnvConfig` to load the appropriate `.env` file based on the
 * current environment (development, production, etc.).
 */
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);
