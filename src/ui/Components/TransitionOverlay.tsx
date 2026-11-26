"use client";

import { useEffect, useState, useCallback, useRef } from "react";
// Use Next's raw pathname, not next-intl's: next-intl maps dynamic URLs back to
// their route template (e.g. "/services/[service]"), so navigating between two
// service pages would never change the value and the curtain would stay down.
import { usePathname } from "next/navigation";

type Phase = "idle" | "covering" | "uncovering";

/**
 * TransitionOverlay — A curtain that slides in to cover `<main>` and slides
 * out to reveal the new page underneath.
 *
 * ## How it works (event-driven + pathname watcher, no store)
 *
 * 1. **`transition:start`** → Phase = `"covering"` → overlay slides IN.
 * 2. **Animation ends** → dispatches `transition:covered` so TransitionLink
 *    knows it's safe to navigate.
 * 3. **Pathname changes** → The overlay detects the URL change directly
 *    (it lives in the layout and persists across navigations).  If the
 *    curtain is covering, it auto-transitions to `"uncovering"`.
 * 4. **Animation ends** → Phase = `"idle"` → overlay unmounts.
 *
 * `<main>` remains a server component — only this thin overlay is client-side.
 */
export function TransitionOverlay() {
	const [phase, setPhase] = useState<Phase>("idle");
	const pathname = usePathname();

	/** Skip the initial mount — only react to *actual* navigation changes. */
	const isInitialMount = useRef(true);

	/**
	 * Watch for URL changes.  When the curtain is covering and the pathname
	 * updates (navigation completed), slide it out to reveal the new page.
	 *
	 * This approach survives React reconciliation — TransitionLink instances
	 * may unmount during route changes, but TransitionOverlay persists in the
	 * layout and detects the pathname change directly.
	 */
	useEffect(() => {
		console.log("[TransitionOverlay] Pathname effect:", { pathname, phase, isInitialMount: isInitialMount.current });
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		if (phase === "covering") {
			console.log("[TransitionOverlay] Switching to uncovering");
			setPhase("uncovering");
		}
	}, [pathname]);

	/** Fires when the slide-in or slide-out CSS animation completes. */
	const onAnimationEnd = useCallback(() => {
		console.log("[TransitionOverlay] Animation end:", phase);
		if (phase === "covering") {
			document.dispatchEvent(new CustomEvent("transition:covered"));
		} else if (phase === "uncovering") {
			setPhase("idle");
		}
	}, [phase]);

	useEffect(() => {
		const onStart = () => {
			console.log("[TransitionOverlay] transition:start received");
			setPhase("covering");
		};

		document.addEventListener("transition:start", onStart);

		return () => {
			document.removeEventListener("transition:start", onStart);
		};
	}, []);

	/* Nothing to render while idle — avoids an empty DOM node. */
	if (phase === "idle") return null;

	console.log("[TransitionOverlay] Rendering overlay with phase:", phase);

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
