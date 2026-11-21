import "@/ui/styles/marquee.css";
import type { CSSProperties, ReactNode } from "react";
import { MarqueePauseButton } from "./MarqueePauseButton";

/** Props for {@link Marquee}. */
interface MarqueeProps<T> {
	/** Items to scroll. */
	items: T[];
	/** Stable key for each item. */
	getKey: (item: T) => string;
	/**
	 * Renders one item. `hidden` is `true` for the duplicate copy that makes
	 * the loop seamless: links in it must not be focusable (`tabIndex={-1}`).
	 */
	renderItem: (item: T, hidden: boolean) => ReactNode;
	/** Accessible label of the pause toggle. */
	pauseLabel: string;
	/** Content shown left of the pause toggle (usually the section heading). */
	header?: ReactNode;
	/** Scroll right-to-left (default) or left-to-right. */
	reverse?: boolean;
	/** Animation length per item, in seconds; total duration scales with the item count. */
	secondsPerItem?: number;
	/**
	 * Minimum number of cards per copy of the list. Short lists are repeated
	 * until they reach it, so the row is always wider than the viewport and
	 * no gap scrolls into view. Repeats are treated like the hidden copy.
	 */
	minItemsPerCopy?: number;
}

/**
 * Infinite, CSS-driven horizontal marquee (server component).
 *
 * The list is rendered twice inside a track that slides by half its width,
 * so the loop is seamless. The second copy is `aria-hidden` and its links are
 * taken out of the tab order via `renderItem(item, true)`.
 *
 * Accessibility: the animation pauses on hover and keyboard focus, and the
 * {@link MarqueePauseButton} pauses every marquee on the page at once
 * (WCAG 2.2.2). With `prefers-reduced-motion: reduce` the animation is off
 * and the single list becomes a horizontally scrollable row. Styles live in
 * `marquee.css`.
 */
export function Marquee<T>({
	items,
	getKey,
	renderItem,
	pauseLabel,
	header,
	reverse = false,
	secondsPerItem = 5,
	minItemsPerCopy = 0,
}: MarqueeProps<T>) {
	const repeats = Math.max(1, Math.ceil(minItemsPerCopy / Math.max(items.length, 1)));
	const style = {
		"--marquee-duration": `${Math.max(items.length, 1) * repeats * secondsPerItem}s`,
	} as CSSProperties;

	/** One copy of the list; only the first pass of the visible copy is exposed. */
	const renderCopy = (hiddenCopy: boolean) =>
		Array.from({ length: repeats }, (_, pass) =>
			items.map((item) => (
				<li
					key={`${pass}-${getKey(item)}`}
					aria-hidden={pass > 0 ? true : undefined}>
					{renderItem(item, hiddenCopy || pass > 0)}
				</li>
			)),
		);

	return (
		<div
			className="marquee"
			data-direction={reverse ? "reverse" : "forward"}
			style={style}>
			<div className="flex items-center justify-between gap-4 mx-4 sm:mx-15">
				{header ?? <span />}
				<MarqueePauseButton label={pauseLabel} />
			</div>

			<div className="marquee-viewport">
				<div className="marquee-track">
					<ul className="marquee-list">{renderCopy(false)}</ul>
					<ul
						className="marquee-list"
						aria-hidden="true">
						{renderCopy(true)}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Marquee;
