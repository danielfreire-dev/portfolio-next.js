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

	/** Enforce no trailing slash for consistent canonical URLs. */
	trailingSlash: false,

	/**
	 * Permanent redirects for legacy/incorrect URLs.
	 *
	 * - Old locale codes (dk→da, cz→cs) — ISO 3166 country codes replaced
	 *   with correct BCP 47 language codes.
	 * - www→non-www redirect is handled externally (Vercel domain redirect
	 *   or DNS provider).  Not included here to avoid redirect loops.
	 * - HTTP→HTTPS is enforced via the Strict-Transport-Security header below.
	 */
	async redirects() {
		return [
			// Old Danish locale (dk → da)
			{ source: "/dk/:path*", destination: "/da/:path*", permanent: true },
			// Old Czech locale (cz → cs)
			{ source: "/cz/:path*", destination: "/cs/:path*", permanent: true },
		];
	},

	/**
	 * Security headers applied to all routes.
	 *
	 * Protects against common web vulnerabilities (XSS, clickjacking, MIME
	 * sniffing) and instructs browsers to always use HTTPS.
	 */
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
		];
	},

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
