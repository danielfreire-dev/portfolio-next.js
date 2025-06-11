import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	"compilerOptions": {
		"strict": true,
		"esModuleInterop": true,
		"lib": [
			"es6",
			"dom"
		],
		"jsx": "react-jsx"
	}
};

export default nextConfig;
