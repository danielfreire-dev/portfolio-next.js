import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	trailingSlash: false, // Enable trailing slashes
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "github.com",
				port: "",
				pathname: "/danielfreire-dev/**",
			},
		],
	},
	env: {
		// Environment variables
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	webpack: (config, { isServer }) => {
		// Custom Webpack configuration
		return config;
	},
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
