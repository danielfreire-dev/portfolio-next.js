import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compilerOptions: {
		strict: true,
		esModuleInterop: true,
		lib: ["es6", "dom"],
		jsx: "react-jsx",
	},
};
module.exports = {
	i18n: {
		locales: ["en-US", "pt-PT"],
		localeDetection: true,
		defaultLocale: "en-US",
		// This is a list of locale domains and the default locale they
		// should handle (these are only required when setting up domain routing)
		// Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
	},
};

export default nextConfig;
