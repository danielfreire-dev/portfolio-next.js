import React from "react";
import type { SVGProps } from "react";

/**
 * ComputerAnimation - An animated computer/monitor SVG icon.
 *
 * Features a monitor with a sliding keyboard tray that drops down, and a
 * stroke-dashoffset animation that draws the monitor outline.
 */
export function ComputerAnimation(props: SVGProps<SVGSVGElement> & { title?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 24 24">
			<title>{props.title ?? "Animated computer monitor with keyboard tray"}</title>
			<path
				fill="currentColor"
				d="M10 16h4v0h-4z">
				<animate
					fill="freeze"
					attributeName="d"
					begin="0.6s"
					dur="0.2s"
					values="M10 16h4v0h-4z;M10 16h4v6h-4z"
				/>
			</path>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2">
				<path
					strokeDasharray="72"
					strokeDashoffset="72"
					d="M12 17h-10v-14h20v14Z">
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						dur="0.6s"
						values="72;0"
					/>
				</path>
				<path
					strokeDasharray="4"
					strokeDashoffset="4"
					d="M12 21h3M12 21h-3">
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.8s"
						dur="0.2s"
						values="4;0"
					/>
				</path>
			</g>
		</svg>
	);
}
