
	// Markdown configuration with GitHub-specific rules
	{
		 files: ["**/*.md"],
		 plugins: {
			markdown,
		},
		processor: "markdown/markdown",
		rules: {
			...markdown.configs.recommended.rules,
			"markdown/no-html": "error",
			"markdown/heading-increment": "error",
			"markdown/no-trailing-punctuation": [
				"error",
				{
					punctuation: ".,;:!",
				},
			],
			"markdown/required-headings": [
				"error",
				{
					headings: [
						"# Project Title",
						"## Description",
						"## Installation",
						"## Overview",
						"## Usage",
						"## Contributing",
					],
				},
			],
			"markdown/fenced-code-blocks": [
				"error",
				{ allow: ["css", "tsx", "typescript", "json"] },
			],
			"markdown/require-fenced-code-blocks": "off",
		},
	},
// JSON configuration (supports JSONC/JSON5)
	{
		files: ["**/*.json", "**/*.json5", "**/*.jsonc"],
		plugins: {
			jsonc,
		},
		rules: {
			...jsonc.configs["recommended-with-jsonc"].rules,
...jsonc.configs["flat/prettier"].rules,
			"jsonc/sort-keys": "warn",
		},
	},
