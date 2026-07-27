const fs = require("fs");
const path = require("path");

/**
 * Collects all JSON message files from the messages directory.
 * Excludes non-message JSON files (e.g., package.json).
 * @returns Array of JSON filenames.
 */
function getMessageFiles() {
  const messagesDir = path.join(__dirname);
  const files = fs.readdirSync(messagesDir);
  return files.filter(
    (file) => file.endsWith(".json") && file !== "package.json",
  ); // Exclude non-message JSON files
}

/**
 * Compares the nested key structure across all message files.
 * Ensures all files have identical keys, types, and array lengths at every
 * nesting level. Logs detailed error messages on mismatch.
 * @param filesData  - Object mapping filenames to their parsed JSON content.
 * @param currentPath - Dot-separated path for error context (default: root).
 * @returns `true` if all structures match, `false` otherwise.
 */
function compareNestedStructures(filesData, currentPath = "") {
  const fileNames = Object.keys(filesData);
  const baseFile = fileNames[0];
  const baseObj = filesData[baseFile];
  const baseKeys = Object.keys(baseObj);

  // Check if all files have the same keys as the base file
  for (const fileName of fileNames.slice(1)) {
    const targetObj = filesData[fileName];
    const targetKeys = Object.keys(targetObj);

    if (!arraysEqual(baseKeys, targetKeys)) {
      const missingInTarget = baseKeys.filter(
        (key) => !targetKeys.includes(key),
      );
      const extraInTarget = targetKeys.filter((key) => !baseKeys.includes(key));

      const errorMessage = `
      🚨 KEY MISMATCH at ${currentPath || "root"} between ${baseFile} and ${fileName}
      --------------------------------------------
      Missing in ${fileName}: ${missingInTarget.length ? missingInTarget.join(", ") : "None"}
      Extra in ${fileName}: ${extraInTarget.length ? extraInTarget.join(", ") : "None"}
      --------------------------------------------
    `;
      console.error(errorMessage);
      return false;
    }
  }

  // Recursively check nested structures
  for (const key of baseKeys) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    const baseVal = baseObj[key];

    // Check if this value is an object in the base file
    if (
      typeof baseVal === "object" &&
      baseVal !== null &&
      !Array.isArray(baseVal)
    ) {
      // Create an object with the same key from all files
      const nestedFilesData = {};
      for (const fileName of fileNames) {
        const targetObj = filesData[fileName];
        const targetVal = targetObj[key];

        // Check if the corresponding value in other files is also an object
        if (
          typeof targetVal !== "object" ||
          targetVal === null ||
          Array.isArray(targetVal)
        ) {
          console.error(
            `🚨 TYPE MISMATCH at ${newPath}: ${baseFile} has object, ${fileName} has ${Array.isArray(targetVal) ? "array" : typeof targetVal}`,
          );
          return false;
        }

        nestedFilesData[fileName] = targetVal;
      }

      if (!compareNestedStructures(nestedFilesData, newPath)) {
        return false;
      }
    }
    // Check arrays (same logic as before)
    else if (Array.isArray(baseVal)) {
      for (const fileName of fileNames.slice(1)) {
        const targetVal = filesData[fileName][key];
        if (!Array.isArray(targetVal)) {
          console.error(
            `🚨 TYPE MISMATCH at ${newPath}: ${baseFile} has array, ${fileName} has ${typeof targetVal}`,
          );
          return false;
        }
        if (baseVal.length !== targetVal.length) {
          console.error(
            `🚨 ARRAY LENGTH MISMATCH at ${newPath}: ${baseFile} has ${baseVal.length} items, ${fileName} has ${targetVal.length}`,
          );
          return false;
        }
      }
    }
    // For primitive values, we don't need to check structure beyond type
    else {
      for (const fileName of fileNames.slice(1)) {
        const targetVal = filesData[fileName][key];
        if (typeof baseVal !== typeof targetVal) {
          console.error(
            `🚨 TYPE MISMATCH at ${newPath}: ${baseFile} has ${typeof baseVal}, ${fileName} has ${typeof targetVal}`,
          );
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if two arrays contain the same items (order-independent).
 * @param a - First array.
 * @param b - Second array.
 * @returns `true` if both arrays have the same length and items.
 */
function arraysEqual(a, b) {
  return a.length === b.length && a.every((item) => b.includes(item));
}

/** Test suite for verifying structural consistency across i18n message files. */
describe("Nested JSON Structure Comparison", () => {
  it("should have the same nested structure across all message files", () => {
    const jsonFiles = getMessageFiles();

    if (jsonFiles.length === 0) {
      console.warn("No JSON files found in messages directory");
      return;
    }

    // Load all JSON files
    const filesData = {};
    for (const file of jsonFiles) {
      const filePath = path.join(__dirname, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      filesData[file] = JSON.parse(fileContent);
    }

    const structuresMatch = compareNestedStructures(filesData);
    expect(structuresMatch).toBe(true);
  });
});
