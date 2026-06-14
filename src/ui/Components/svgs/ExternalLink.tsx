import { SVGProps } from "react";

/**
 * ExternalLink - An animated external link SVG icon.
 *
 * Draws a box with an arrow pointing outward, using stroke-dashoffset
 * animations for a sequential "drawing" effect.
 */
export function ExternalLink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* <!-- eslint-disable-next-line i18next/no-literal-string -->
			<title>Externa	l-link SVG Icon</title> */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path strokeDasharray="42" strokeDashoffset="42" d="M11 5H5V19H19V13">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="42;0"
          />
        </path>
        <path strokeDasharray="12" strokeDashoffset="12" d="M13 11L20 4">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.3s"
            values="12;0"
          />
        </path>
        <path strokeDasharray="8" strokeDashoffset="8" d="M21 3H15M21 3V9">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.9s"
            dur="0.2s"
            values="8;0"
          />
        </path>
      </g>
    </svg>
  );
}
