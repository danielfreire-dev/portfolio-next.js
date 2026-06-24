// Ensure .env files are loaded before any config evaluation.
// This is critical for OpenNext/Cloudflare builds where the standard
// Next.js env-loading can be bypassed by the adapter.
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Next.js configuration object.
 *
 * Enables React strict mode for development warnings, customises the
 * webpack config to handle SVG imports via @svgr/webpack, and whitelists
 * allowed development origins for network access.
 */
export const nextConfig: NextConfig = {
	// Enable React strict mode to catch potential issues in development
	reactStrictMode: true,

	/**
	 * Custom webpack configuration.
	 * Adds a rule to import SVG files as React components using @svgr/webpack.
	 * @param config - The webpack configuration object
	 * @returns The modified webpack configuration
	 */
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [{ loader: "@svgr/webpack", options: { icon: true } }],
		});

		return config;
	},

	// PostHog reverse proxy rewrite (commented out — uncomment for self-hosted ingestion)
	/* async rewrites() {
		return [
			{
				source: "/ingest/:path*",
				destination: "https://app.posthog.com/:path*",
			},
		];
	}, */

	// Allowed origins for development server access from other devices on the network
	allowedDevOrigins: [
		"http://192.168.1.13:3000/*", // Replace with your actual IP and port
		"http://localhost:3000/*", // Include localhost for local development
		"local-origin.dev",
		"*.local-origin.dev",
	],
};

/**
 * Initialise the next-intl plugin for internationalisation support.
 */
const withNextIntl = createNextIntlPlugin();

// Export the wrapped configuration
export default withNextIntl(nextConfig);

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
