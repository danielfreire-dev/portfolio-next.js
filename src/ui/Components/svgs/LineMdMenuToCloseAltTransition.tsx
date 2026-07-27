import React from "react";
import type { SVGProps } from "react";

/**
 * LineMdMenuToCloseAltTransition - Animated hamburger menu to close (X) transition.
 *
 * Animates from a hamburger menu icon (three horizontal lines) to a close icon
 * (two diagonal lines) using SVG path morphing.
 */
export function LineMdMenuToCloseAltTransition(props: SVGProps<SVGSVGElement> & { title?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.5em"
			height="1.5em"
			viewBox="0 0 24 24"
			{...props}>
			<title>{props.title ?? "Menu to close transition icon"}</title>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}>
				<path d="M5 12H19">
					<animate
						fill="freeze"
						attributeName="d"
						dur="0.4s"
						values="M5 12H19;M12 12H12"
					/>
					<set
						fill="freeze"
						attributeName="opacity"
						begin="0.4s"
						to={0}
					/>
				</path>
				<path
					d="M5 5L19 5M5 19L19 19"
					opacity={0}>
					<animate
						fill="freeze"
						attributeName="d"
						begin="0.2s"
						dur="0.4s"
						values="M5 5L19 5M5 19L19 19;M5 5L19 19M5 19L19 5"
					/>
					<set
						fill="freeze"
						attributeName="opacity"
						begin="0.2s"
						to={1}
					/>
				</path>
			</g>
		</svg>
	);
}
