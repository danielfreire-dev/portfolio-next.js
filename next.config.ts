import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

export const nextConfig: NextConfig = {
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [{ loader: "@svgr/webpack", options: { icon: true } }],
		});

		return config;
	},
	async rewrites() {
		return [
			{
				source: "/ingest/:path*",
				destination: "https://app.posthog.com/:path*",
			},
		];
	},
	allowedDevOrigins: [
		"http://192.168.1.13:3000/*", // Replace with your actual IP and port
		"http://localhost:3000/*", // Include localhost for local development
	],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
