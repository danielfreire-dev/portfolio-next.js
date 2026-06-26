#!/usr/bin/env node
/**
 * Synchronizes .dev.vars from the canonical .env file.
 *
 * The .env file is the single source of truth for all environment variables.
 * .dev.vars (Cloudflare/Wrangler format) is auto-generated and should never
 * be edited manually.  Both formats use identical KEY=VALUE syntax.
 *
 * Usage:
 *   node scripts/sync-env.mjs             # Generate .dev.vars from .env
 *   node scripts/sync-env.mjs --check     # Check if files are in sync (exit ≠0 if not)
 *   node scripts/sync-env.mjs --reverse   # Generate .env from .dev.vars (backfill)
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const ENV_FILE = resolve(ROOT, ".env");
const DEV_VARS_FILE = resolve(ROOT, ".dev.vars");

/**
 * Parse a KEY=VALUE env file into a Map, skipping comments and blank lines.
 */
function parseEnvFile(path) {
	const content = readFileSync(path, "utf-8");
	const vars = new Map();
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed.slice(eqIndex + 1).trim();
		if (key) vars.set(key, value);
	}
	return vars;
}

/**
 * Serialize a Map<string,string> back to KEY=VALUE format.
 */
function formatEnvFile(vars) {
	const lines = [
		"# Auto-generated from .env by scripts/sync-env.mjs",
		"# Do not edit manually — edit .env and run `npm run sync:env`",
		"",
	];
	for (const [key, value] of vars) {
		lines.push(`${key}=${value}`);
	}
	return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const checkMode = args.includes("--check");
const reverseMode = args.includes("--reverse");

if (reverseMode) {
	// -----------------------------------------------------------------------
	// Reverse mode: .dev.vars → .env  (backfill / emergency recovery)
	// -----------------------------------------------------------------------
	if (!existsSync(DEV_VARS_FILE)) {
		console.error("❌ .dev.vars not found");
		exit(1);
	}
	const vars = parseEnvFile(DEV_VARS_FILE);
	writeFileSync(ENV_FILE, formatEnvFile(vars), "utf-8");
	console.log("✅ .env generated from .dev.vars");
} else if (checkMode) {
	// -----------------------------------------------------------------------
	// Check mode: compare .env ↔ .dev.vars for parity
	// -----------------------------------------------------------------------
	if (!existsSync(ENV_FILE)) {
		console.error("❌ .env not found");
		exit(1);
	}
	if (!existsSync(DEV_VARS_FILE)) {
		console.error("❌ .dev.vars not found — run `npm run sync:env` to generate it");
		exit(1);
	}

	const envVars = parseEnvFile(ENV_FILE);
	const devVars = parseEnvFile(DEV_VARS_FILE);

	const envKeys = new Set(envVars.keys());
	const devKeys = new Set(devVars.keys());

	const onlyInEnv = [...envKeys].filter((k) => !devKeys.has(k));
	const onlyInDev = [...devKeys].filter((k) => !envKeys.has(k));

	let mismatch = false;

	if (onlyInEnv.length > 0) {
		console.error(`❌ Keys in .env but missing from .dev.vars: ${onlyInEnv.join(", ")}`);
		mismatch = true;
	}
	if (onlyInDev.length > 0) {
		console.error(`❌ Keys in .dev.vars but missing from .env: ${onlyInDev.join(", ")}`);
		mismatch = true;
	}

	for (const [key, value] of envVars) {
		if (devVars.has(key) && devVars.get(key) !== value) {
			console.error(`❌ Value mismatch for ${key}:`);
			console.error(`   .env:      ${value}`);
			console.error(`   .dev.vars: ${devVars.get(key)}`);
			mismatch = true;
		}
	}

	if (mismatch) {
		console.error("\nRun `npm run sync:env` to regenerate .dev.vars from .env.");
		exit(1);
	}

	console.log("✅ .env and .dev.vars are in sync");
} else {
	// -----------------------------------------------------------------------
	// Default: .env → .dev.vars  (generate)
	// -----------------------------------------------------------------------
	if (!existsSync(ENV_FILE)) {
		console.error("❌ .env not found");
		exit(1);
	}
	const vars = parseEnvFile(ENV_FILE);
	writeFileSync(DEV_VARS_FILE, formatEnvFile(vars), "utf-8");
	console.log("✅ .dev.vars generated from .env");
}
