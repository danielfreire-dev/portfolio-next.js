import { readdirSync, readFileSync } from "fs";
import { join, extname } from "path";
import { describe, it } from "vitest";

// Recursively get all files in a directory
const getFiles = (dir, files = []) => {
	const items = readdirSync(dir, { withFileTypes: true });
	for (const item of items) {
		const fullPath = join(dir, item.name);
		if (item.isDirectory()) {
			getFiles(fullPath, files);
		} else if (extname(item.name) === ".json") {
			files.push(fullPath);
		}
	}
	return files;
};

// Recursively check an object for forbidden patterns
const checkObject = (obj, filePath, currentPath = []) => {
	for (const [key, value] of Object.entries(obj)) {
		const newPath = [...currentPath, key];
		if (typeof value === "string") {
			if (/(?:\.jpg|\.jpeg)/i.test(value)) {
				throw new Error(
					`❌ Found forbidden image reference in ${filePath} at path ${newPath.join(".")}: ${value}`,
				);
			}
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (typeof item === "string") {
					if (/(?:\.jpg|\.jpeg)/i.test(item)) {
						throw new Error(
							`❌ Found forbidden image reference in ${filePath} at path ${newPath.join(".")}[${index}]: ${item}`,
						);
					}
				} else if (typeof item === "object" && item !== null) {
					checkObject(item, filePath, [...newPath, `[${index}]`]);
				}
			});
		} else if (typeof value === "object" && value !== null) {
			checkObject(value, filePath, newPath);
		}
	}
};

const validateJson = (content, filePath) => {
	try {
		JSON.parse(content);
		return true;
	} catch (error) {
		console.error(`Invalid JSON in ${filePath}:`, error.message);
		return false;
	}
};

describe("i18n files", () => {
	it("should be valid JSON and not contain forbidden image references", () => {
		const localesDir = __dirname;
		const files = getFiles(localesDir);

		if (files.length === 0) {
			throw new Error("No JSON files found");
		}

		for (const file of files) {
			const content = readFileSync(file, "utf-8");

			// First validate JSON
			if (!validateJson(content, file)) {
				throw new Error(`Invalid JSON in ${file}`);
			}

			const json = JSON.parse(content);
			checkObject(json, file);
		}
	});
});
