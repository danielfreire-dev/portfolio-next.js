/**
 * Accessibility Checker Engine (ACE) configuration.
 *
 * This fixture configures the `cypress-accessibility-checker` plugin,
 * defining which rules to run, which severity levels to report, and
 * where to store output artifacts.
 *
 * @module aceconfig
 */
module.exports = {
  // Use the latest rule archive from the accessibility checker
  ruleArchive: "latest",

  // Apply IBM Accessibility (WCAG-based) policies
  policies: ["IBM_Accessibility"],

  // Fail the test on violations and potential violations
  failLevels: ["violation", "potentialviolation"],

  // Include all severity levels in the report output
  reportLevels: [
    "violation",
    "potentialviolation",
    "recommendation",
    "potentialrecommendation",
    "manual",
    "pass",
  ],

  // Output results in JSON format
  outputFormat: ["json"],

  // Append a timestamp to the output filename for uniqueness
  outputFilenameTimestamp: true,

  // Label results with the current CI branch name (if available)
  label: [process.env.TRAVIS_BRANCH],

  // Directory for scan result output files
  outputFolder: "results",

  // Baseline folder for comparing against known results
  baselineFolder: "test/baselines",

  // Cache directory for the accessibility checker engine
  cacheFolder: "/tmp/accessibility-checker",

  // Additional arguments passed to Puppeteer (used by the checker engine)
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
};
