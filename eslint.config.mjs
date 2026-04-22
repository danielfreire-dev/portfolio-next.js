/**
 * ESLint flat configuration for the Next.js portfolio project.
 *
 * Defines linting rules across multiple file types:
 * - TypeScript/TSX: type-aware linting with @typescript-eslint
 * - React/JSX: React, React Hooks, jsx-a11y, and i18next rules
 * - CSS: Tailwind CSS v4-aware linting via @eslint/css
 * - Markdown: GitHub-Flavoured Markdown linting
 * - JSON/JSONC/JSON5: formatting and key sorting
 *
 * @module eslint.config
 */

import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import i18next from "eslint-plugin-i18next";
import jsonc from "eslint-plugin-jsonc";
import css from "@eslint/css";
import { tailwind4 } from "tailwind-csstree";
import markdown from "@eslint/markdown";
import md from "eslint-plugin-markdown";

export default [
  // ──────────────────────────────────────────────
  // TypeScript configuration
  // ──────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      /* ...ts.configs.recommended.rules,
			...ts.configs.stylistic?.rules, */
      // Warn on unused variables, ignoring those prefixed with underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      // Disable prefer-for-of to allow traditional for loops
      "@typescript-eslint/prefer-for-of": "off",
    },
  },

  // ──────────────────────────────────────────────
  // React + JSX + Accessibility + i18n
  // ──────────────────────────────────────────────
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      i18next: i18next,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      // Spread the recommended jsx-a11y rules as a base
      ...jsxA11y.configs.recommended.rules,

      /* ── React recommended rules ── */
      "react/display-name": "error",
      "react/jsx-key": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-undef": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/no-unsafe": "off",
      "react/prop-types": "error",
      "react/react-in-jsx-scope": "error",
      "react/require-render-return": "error",

      /* ── React stylistic / best-practice warnings ── */
      "react/jsx-boolean-value": "warn",
      "react/jsx-curly-brace-presence": "warn",
      "react/jsx-fragments": "warn",
      "react/jsx-pascal-case": "warn",
      "react/no-access-state-in-setstate": "warn",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-did-mount-set-state": "warn",
      "react/no-did-update-set-state": "warn",
      "react/no-multi-comp": "warn",
      "react/no-unused-prop-types": "warn",
      "react/prefer-es6-class": "warn",
      "react/prefer-stateless-function": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/style-prop-object": "warn",
      "react/void-dom-elements-no-children": "warn",
      "react/jsx-filename-extension": "off",

      /* ── React Hooks rules ── */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* ── jsx-a11y accessibility rules ── */
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link", "a"],
          specialLink: ["hrefLeft", "hrefRight", "to"],
          aspects: ["noHref", "invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          labelComponents: [],
          labelAttributes: ["label"],
          controlComponents: ["Input"],
          assert: "both",
          depth: 25,
        },
      ],
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img", "object", "area", 'input[type="image"]'],
          img: [],
          object: [],
          area: [],
          'input[type="image"]': [],
        },
      ],
      "jsx-a11y/control-has-associated-label": [
        "error",
        {
          labelAttributes: ["label"],
          controlComponents: [],
          ignoreElements: [
            "audio",
            "canvas",
            "embed",
            "input",
            "textarea",
            "tr",
            "video",
          ],
          ignoreRoles: [
            "grid",
            "listbox",
            "menu",
            "menubar",
            "radiogroup",
            "row",
            "tablist",
            "toolbar",
            "tree",
            "treegrid",
          ],
          depth: 5,
        },
      ],
      "jsx-a11y/scope": "warn",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/anchor-has-content": ["error", { components: [] }],
      "jsx-a11y/anchor-ambiguous-text": "warn",
      "jsx-a11y/aria-role": ["error", { ignoreNonDOM: false }],
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/aria-activedescendant-has-tabindex": "error",
      "jsx-a11y/autocomplete-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": ["error", { components: [""] }],
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "warn",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/no-aria-hidden-on-focusable": "warn",
      "jsx-a11y/lang": "error",
      "jsx-a11y/media-has-caption": [
        "error",
        {
          audio: [],
          video: [],
          track: [],
        },
      ],
      "jsx-a11y/mouse-events-have-key-events": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-distracting-elements": [
        "error",
        {
          elements: ["marquee", "blink"],
        },
      ],
      "jsx-a11y/no-interactive-element-to-noninteractive-role": [
        "error",
        {
          tr: ["none", "presentation"],
        },
      ],
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],
      "jsx-a11y/no-noninteractive-element-to-interactive-role": [
        "error",
        {
          ul: [
            "listbox",
            "menu",
            "menubar",
            "radiogroup",
            "tablist",
            "tree",
            "treegrid",
          ],
          ol: [
            "listbox",
            "menu",
            "menubar",
            "radiogroup",
            "tablist",
            "tree",
            "treegrid",
          ],
          li: ["menuitem", "option", "row", "tab", "treeitem"],
          table: ["grid"],
          td: ["gridcell"],
        },
      ],
      "jsx-a11y/no-noninteractive-tabindex": [
        "warn",
        {
          tags: [],
          roles: ["tabpanel"],
          allowExpressionValues: true,
        },
      ],
      "jsx-a11y/no-static-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],
      "jsx-a11y/prefer-tag-over-role": "off",
      "jsx-a11y/no-redundant-roles": [
        "error",
        {
          nav: ["navigation"],
        },
      ],
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/tabindex-no-positive": "warn",

      /* ── Internationalisation rules ── */
      "i18next/no-literal-string": [
        "error",
        {
          mode: "jsx-only",
          "jsx-attributes": {
            include: [
              "title",
              "aria-*",
              "caption",
              "placeholder",
              "label",
              "helpText",
              "stringError",
              "legend",
            ],
          },
          "should-validate-template": true,
          ignoreCallees: ["console", "require"],
          ignoreAttribute: ["direction", "size", "as", "align"],
        },
      ],
      "jsx-a11y/scope": "error",
    },
  },

  // ──────────────────────────────────────────────
  // CSS — Tailwind CSS v4 aware linting
  // ──────────────────────────────────────────────
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    languageOptions: {
      customSyntax: tailwind4,
    },
    rules: {
      ...css.configs.recommended.rules,
      "css/no-invalid-named-grid-areas": "error",
      "css/no-duplicate-imports": "error",
      "css/no-empty-blocks": "error",
      "css/no-important": "warn",
      // Disable irrelevant ESLint core rules for CSS files
      "css/no-invalid-properties": "off",
      "css/use-layers": "off",
      "css/use-baseline": "off",
      "no-irregular-whitespace": "off",
      "no-invalid-this": "off",
    },
  },

  // ──────────────────────────────────────────────
  // Markdown — GitHub-Flavoured Markdown linting
  // ──────────────────────────────────────────────
  {
    files: ["**/*.md"],
    plugins: {
      markdown,
      md,
    },
    language: "markdown/gfm",
    rules: {
      ...markdown.configs.recommended.rules,
      "no-irregular-whitespace": "off",
      "markdown/no-html": "error",
      "markdown/heading-increment": "error",
      "markdown/no-duplicate-headings": "warn",
      "markdown/require-alt-text": "warn",
      "markdown/no-multiple-h1": "error",
    },
  },
  // Fenced code blocks inside .md files
  {
    files: ["**/*.md/*.js"],
    rules: {
      "no-console": "off",
      "import/no-unresolved": "off",
      ...md.configs.recommended.rules,
      "md/no-html": "warn",
      "md/no-html-comments": "error",
      "md/require-fenced-code-blocks": "warn",
    },
  },

  // ──────────────────────────────────────────────
  // JSON / JSONC / JSON5
  // ──────────────────────────────────────────────
  {
    files: ["**/*.json", "**/*.json5", "**/*.jsonc"],
    plugins: {
      jsonc,
    },
    languageOptions: {
      parser: jsonc,
    },
    rules: {
      ...jsonc.configs["flat/recommended-with-json"].rules,
      ...jsonc.configs["flat/prettier"].rules,
      "jsonc/sort-keys": "warn",
    },
  },

  // ──────────────────────────────────────────────
  // Global ignores
  // ──────────────────────────────────────────────
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "public/",
      "*.d.ts",
      "!.github/", // Include .github directory for config files
    ],
  },

  // Global overrides (duplicate ignores block)
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "public/",
      "*.d.ts",
    ],
  },

  // ──────────────────────────────────────────────
  // Test file overrides
  // ──────────────────────────────────────────────
  {
    files: ["**/*.test.{ts,tsx}", "**/__mocks__/**", "**/test-utils/**"],
    rules: {
      "i18next/no-literal-string": "warn",
      "jsx-a11y/media-has-caption": "off",
    },
  },

  // ──────────────────────────────────────────────
  // Type definition overrides
  // ──────────────────────────────────────────────
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Config file overrides (disable type-aware project for non-source configs)
  {
    files: [
      "rollup.config.*",
      ".eslintrc.*",
      "jest.config.*",
      "babel.config.*",
    ],
    parserOptions: {
      project: null,
    },
    env: {
      node: true,
    },
  },

  // Package-specific overrides (relaxed rules for PostHog / AI / core packages)
  {
    files: [
      "packages/ai/**",
      "packages/core/**",
      "packages/nextjs-config/**",
      "packages/react-native/**",
      "packages/node/**",
      "packages/web/**",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/naming-convention": "off",
      "posthog-js/no-direct-undefined-check": "off",
      "posthog-js/no-direct-boolean-check": "off",
      "posthog-js/no-direct-null-check": "off",
      "posthog-js/no-direct-function-check": "off",
      "posthog-js/no-direct-number-check": "off",
      "posthog-js/no-direct-date-check": "off",
      "posthog-js/no-direct-array-check": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "posthog-js/no-add-event-listener": "off",
      "no-constant-condition": "off",
      "compat/compat": "off",
    },
  },
];
