"use client";

import { useEffect, useState, useCallback } from "react";

type Phase = "idle" | "covering" | "uncovering";

/**
 * TransitionOverlay — A full-screen curtain that slides in to cover the old
 * page content and slides out to reveal the new page.
 *
 * ## How it works (event-driven, no store)
 *
 * 1. **`transition:start`** → Phase = `"covering"` → overlay slides IN
 *    (covers `<main>` so the user sees a blank curtain).
 * 2. **Animation ends** → dispatches `transition:covered` so TransitionLink
 *    knows it's safe to navigate.
 * 3. **`transition:reveal`** → Phase = `"uncovering"` → overlay slides OUT
 *    revealing the newly loaded page underneath.
 * 4. **Animation ends** → Phase = `"idle"` → overlay unmounts.
 *
 * `<main>` remains a server component — only this thin overlay is client-side.
 */
export function TransitionOverlay() {
	const [phase, setPhase] = useState<Phase>("idle");

	/** Fires when the slide-in or slide-out CSS animation completes. */
	const onAnimationEnd = useCallback(() => {
		if (phase === "covering") {
			document.dispatchEvent(new CustomEvent("transition:covered"));
		} else if (phase === "uncovering") {
			setPhase("idle");
		}
	}, [phase]);

	useEffect(() => {
		const onStart = () => setPhase("covering");
		const onReveal = () => setPhase("uncovering");

		document.addEventListener("transition:start", onStart);
		document.addEventListener("transition:reveal", onReveal);

		return () => {
			document.removeEventListener("transition:start", onStart);
			document.removeEventListener("transition:reveal", onReveal);
		};
	}, []);

	/* Nothing to render while idle — avoids an empty DOM node. */
	if (phase === "idle") return null;

	return (
		<div
			aria-hidden="true"
			className={`absolute inset-0 z-50 bg-(--background) ${
				phase === "covering" ? "animate-slide-in-cover" : "animate-slide-out-cover"
			}`}
			onAnimationEnd={onAnimationEnd}
		/>
	);
}
