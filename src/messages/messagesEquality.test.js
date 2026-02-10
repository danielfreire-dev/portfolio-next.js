const fs = require("fs");
const path = require("path");

function compareNestedStructures(
	objEn,
	objPt,
	objDk,
	objPl,
	objDe,
	objCz,
	currentPath = "",
) {
	const keysEn = Object.keys(objEn);
	const keysPt = Object.keys(objPt);
	const keysDk = Object.keys(objDk);
	const keysPl = Object.keys(objPl);
	const keysDe = Object.keys(objDe);
	const keysCz = Object.keys(objCz);

	if (!arraysEqual(keysEn, keysPt)) {
		const missingInPt = keysEn.filter((key) => !keysPt.includes(key));
		const missingInEn = keysPt.filter((key) => !keysEn.includes(key));
		const missingInDk = keysEn.filter((key) => !keysDk.includes(key));
		const missingInPl = keysEn.filter((key) => !keysPl.includes(key));
		const missingInDe = keysEn.filter((key) => !keysDe.includes(key));
		const missingInCz = keysEn.filter((key) => !keysCz.includes(key));

		const errorMessage = `
      🚨 KEY MISMATCH at ${currentPath || "root"}
      --------------------------------------------
      Missing in pt.json: ${missingInPt.length ? missingInPt.join(", ") : "None"}
      Missing in en.json: ${missingInEn.length ? missingInEn.join(", ") : "None"}
      Missing in dk.json: ${missingInDk.length ? missingInDk.join(", ") : "None"}
      Missing in pl.json: ${missingInPl.length ? missingInPl.join(", ") : "None"}
      Missing in de.json: ${missingInDe.length ? missingInDe.join(", ") : "None"}
      Missing in cz.json: ${missingInCz.length ? missingInCz.join(", ") : "None"}
      --------------------------------------------
    `;
		console.error(errorMessage);
		return false;
	}

	for (const key of keysEn) {
		const newPath = currentPath ? `${currentPath}.${key}` : key;
		const valEn = objEn[key];
		const valPt = objPt[key];
		const valDk = objDk[key];
		const valPl = objPl[key];
		const valDe = objDe[key];
		const valCz = objCz[key];

		if (
			typeof valEn === "object" &&
			typeof valPt === "object" &&
			valEn !== null &&
			valPt !== null
		) {
			if (Array.isArray(valEn) !== Array.isArray(valPt)) {
				console.error(
					`🚨 TYPE MISMATCH at ${newPath}: one is an array, the other is an object`,
				);
				return false;
			}

			if (Array.isArray(valEn)) {
				if (valEn.length !== valPt.length) {
					console.error(
						`🚨 ARRAY LENGTH MISMATCH at ${newPath}: en.json has ${valEn.length} items, pt.json has ${valPt.length}`,
					);
					return false;
				}
			} else {
				if (!compareNestedStructures(valEn, valPt, newPath)) {
					return false;
				}
			}
		} else if (
			(typeof valEn === "object" && valPt !== "object") ||
			(typeof valPt === "object" && valEn !== "object")
		) {
			console.error(
				`🚨 TYPE MISMATCH at ${newPath}: en.json has ${typeof valEn}, pt.json has ${typeof valPt}`,
			);
			return false;
		}
	}

	return true;
}

function arraysEqual(a, b) {
	return a.length === b.length && a.every((item) => b.includes(item));
}

describe("Nested JSON Structure Comparison", () => {
	it("should have the same nested structure", () => {
		const fileEnContent = fs.readFileSync("./src/messages/en.json", "utf-8");
		const filePtContent = fs.readFileSync("./src/messages/pt.json", "utf-8");
		const fileDkContent = fs.readFileSync("./src/messages/dk.json", "utf-8");
		const filePlContent = fs.readFileSync("./src/messages/pl.json", "utf-8");
		const fileDeContent = fs.readFileSync("./src/messages/de.json", "utf-8");
		const fileCzContent = fs.readFileSync("./src/messages/cz.json", "utf-8");

		const objEn = JSON.parse(fileEnContent);
		const objPt = JSON.parse(filePtContent);
		const objDk = JSON.parse(fileDkContent);
		const objPl = JSON.parse(filePlContent);
		const objDe = JSON.parse(fileDeContent);
		const objCz = JSON.parse(fileCzContent);

		const structuresMatch = compareNestedStructures(
			objEn,
			objPt,
			objDk,
			objPl,
			objDe,
			objCz,
		);
		expect(structuresMatch).toBe(true);
	});
});
