/**
 * SVG icon barrel export.
 *
 * Aggregates all SVG icon components from individual files into a single
 * namespace (`SVGs`). Consumers can import from this module and dynamically
 * resolve icon components by key (e.g., `SVGs[data.svgr]`), which powers the
 * tech-stack card grid where icons are driven by translation data. This
 * pattern avoids a long chain of conditional imports in the consumer.
 */

export { default as Nextjs } from "./nextjs.svg";
export { default as Reactjs } from "./react.svg";
export { default as Nodejs } from "./node-js.svg";
export { default as TypeScript } from "./typescript.svg";
export { default as JavaScript } from "./javascript.svg";
export { default as HTML5 } from "./html5.svg";
export { default as CSS3 } from "./css.svg";
export { default as PostgreSQL } from "./postgresql.svg";
export { default as Webpack } from "./webpack.svg";
export { default as Vitejs } from "./vitejs.svg";
export { default as Git } from "./git.svg";
export { default as Github } from "./github.svg";
export { default as Vitest } from "./vitest.svg";
export { default as Jest } from "./jest.svg";
export { default as Selenium } from "./selenium.svg";
export { default as Python } from "./python.svg";
export { default as Linux } from "./linux.svg";
export { default as Bash } from "./bash.svg";
export { default as Zsh } from "./zsh.svg";
export { default as GitHubIcon } from "./github-square.svg";
export { default as LinkedInIcon } from "./linkedin-square.svg";
export { default as Sun } from "./sun.svg";
export { default as Moon } from "./moon1.svg";
