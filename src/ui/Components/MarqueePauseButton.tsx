"use client";

import { useEffect } from "react";
import { useMarqueeStore } from "@/stores/marquee-store";

/**
 * Pause / resume toggle shared by every marquee (WCAG 2.2.2).
 *
 * Clicking any instance pauses all marquees: the state lives in
 * {@link useMarqueeStore} and is mirrored to `data-marquee-paused` on `<html>`,
 * which `marquee.css` uses to stop every track. `aria-pressed` reports the
 * state, so the label stays the same ("Pause animations").
 */
export function MarqueePauseButton({ label }: { label: string }) {
	const paused = useMarqueeStore((state) => state.paused);
	const togglePaused = useMarqueeStore((state) => state.togglePaused);

	useEffect(() => {
		document.documentElement.toggleAttribute("data-marquee-paused", paused);
	}, [paused]);

	return (
		<button
			type="button"
			className="marquee-pause"
			aria-pressed={paused}
			aria-label={label}
			title={label}
			onClick={togglePaused}>
			{paused ?
				<svg
					viewBox="0 0 16 16"
					width="14"
					height="14"
					aria-hidden="true"
					fill="currentColor">
					<path d="M4 2l10 6-10 6z" />
				</svg>
			:	<svg
					viewBox="0 0 16 16"
					width="14"
					height="14"
					aria-hidden="true"
					fill="currentColor">
					<rect
						x="3"
						y="2"
						width="3.5"
						height="12"
					/>
					<rect
						x="9.5"
						y="2"
						width="3.5"
						height="12"
					/>
				</svg>
			}
		</button>
	);
}

export default MarqueePauseButton;
