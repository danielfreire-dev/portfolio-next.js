import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Environment variable documentation validator.
 *
 * Scans the source tree for every `NEXT_PUBLIC_*` environment variable
 * reference and asserts that it is documented in `.env.example`.
 *
 * This prevents the class of bug where a developer adds a new
 * `NEXT_PUBLIC_*` variable in code but forgets to list it in the
 * example env file — which results in the variable being missing
 * in production builds (e.g. Turnstile not rendering).
 */

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..", "..");

/** Recursively walk a directory and return absolute paths to all files matching a glob. */
function walkDir(dir: string, ext: string): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			// Skip node_modules and .next and test directories
			if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "__tests__") {
				continue;
			}
			files.push(...walkDir(full, ext));
		} else if (entry.name.endsWith(ext)) {
			files.push(full);
		}
	}
	return files;
}

/** Extract all unique NEXT_PUBLIC_* variable names from source content. */
function extractPublicEnvVars(content: string): Set<string> {
	const vars = new Set<string>();
	// Match: process.env.NEXT_PUBLIC_VARNAME
	const regex = /process\.env\.NEXT_PUBLIC_(\w+)/g;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(content)) !== null) {
		vars.add(`NEXT_PUBLIC_${match[1]}`);
	}
	return vars;
}

/** Read .env.example and extract variable names (lines that start with NEXT_PUBLIC_). */
function readEnvExampleKeys(): Set<string> {
	const envPath = path.join(PROJECT_ROOT, ".env.example");
	if (!fs.existsSync(envPath)) {
		throw new Error(`.env.example not found at ${envPath}`);
	}
	const content = fs.readFileSync(envPath, "utf-8");
	const keys = new Set<string>();
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		// Skip comments and empty lines
		if (!trimmed || trimmed.startsWith("#")) continue;
		// Extract the key name (handles KEY=VALUE and bare KEY lines)
		const key = trimmed.split("=")[0].trim();
		if (key.startsWith("NEXT_PUBLIC_")) {
			keys.add(key);
		}
	}
	return keys;
}

describe("Environment variable documentation", () => {
	it("should list every NEXT_PUBLIC_* variable used in source code in .env.example", () => {
		// Collect all NEXT_PUBLIC_* vars from source
		const sourceFiles = walkDir(path.join(PROJECT_ROOT, "src"), ".ts").concat(
			walkDir(path.join(PROJECT_ROOT, "src"), ".tsx"),
		);

		const allPublicVars = new Set<string>();
		for (const file of sourceFiles) {
			const content = fs.readFileSync(file, "utf-8");
			for (const v of extractPublicEnvVars(content)) {
				allPublicVars.add(v);
			}
		}

		// Read what's documented in .env.example
		const documentedVars = readEnvExampleKeys();

		// Report any undocumented vars
		const undocumented = [...allPublicVars].filter((v) => !documentedVars.has(v));

		expect(undocumented).toEqual([]);
	});

	it(".env.example should contain the Turnstile site key entry", () => {
		const documentedVars = readEnvExampleKeys();
		expect(documentedVars.has("NEXT_PUBLIC_TURNSTILE_SITE_KEY")).toBe(true);
	});

	it(".env.example should contain the Turnstile secret key entry (private, TURNSTILE_SECRET_KEY)", () => {
		const envPath = path.join(PROJECT_ROOT, ".env.example");
		const content = fs.readFileSync(envPath, "utf-8");
		expect(content).toContain("TURNSTILE_SECRET_KEY");
	});
});
