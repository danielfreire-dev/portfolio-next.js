import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Intercepts .css imports and returns an empty module.
 * Changes the resolved extension to `.css-stub` so Vite's built-in CSS
 * pipeline skips it, avoiding the PostCSS / Tailwind CSS v4
 * incompatibility in jsdom.
 */
function cssStubPlugin(): Plugin {
	return {
		name: "css-intercept",
		enforce: "pre",
		resolveId(source, importer) {
			if (source.endsWith(".css") && importer) {
				const resolved = path.resolve(path.dirname(importer), source);
				// Strip .css and add .css-stub so Vite doesn't treat it as CSS
				return resolved.replace(/\.css$/, ".css-stub");
			}
			return null;
		},
		load(id) {
			if (id.endsWith(".css-stub")) {
				return { code: "", moduleSideEffects: false };
			}
			return null;
		},
	};
}

export default defineConfig({
	plugins: [tsconfigPaths(), react(), cssStubPlugin()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/test/setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
		server: {
			deps: {
				inline: ["next-intl"],
			},
		},
	},
});
