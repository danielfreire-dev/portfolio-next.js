import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { Marquee } from "@/ui/Components/Marquee";
import { useMarqueeStore } from "@/stores/marquee-store";

const items = ["alpha", "beta", "gamma"];

const marquee = (props: { reverse?: boolean; minItemsPerCopy?: number } = {}) => (
	<Marquee
		items={items}
		getKey={(item) => item}
		pauseLabel="Pause animations"
		secondsPerItem={4}
		header={<h2>Heading</h2>}
		renderItem={(item, hidden) => (
			<a
				href={`/${item}`}
				tabIndex={hidden ? -1 : undefined}>
				{item}
			</a>
		)}
		{...props}
	/>
);

beforeEach(() => {
	useMarqueeStore.setState({ paused: false });
	document.documentElement.removeAttribute("data-marquee-paused");
});

describe("Marquee", () => {
	it("renders every item twice for a seamless loop", () => {
		const { container } = render(marquee());
		expect(container.querySelectorAll(".marquee-list")).toHaveLength(2);
		expect(container.querySelectorAll("a")).toHaveLength(items.length * 2);
	});

	it("hides the duplicate copy from assistive tech and the tab order", () => {
		const { container } = render(marquee());
		const [visible, duplicate] = container.querySelectorAll(".marquee-list");
		expect(visible).not.toHaveAttribute("aria-hidden");
		expect(duplicate).toHaveAttribute("aria-hidden", "true");
		duplicate.querySelectorAll("a").forEach((link) => expect(link).toHaveAttribute("tabindex", "-1"));
		expect(screen.getAllByRole("link")).toHaveLength(items.length);
	});

	it("repeats short lists but exposes each item only once", () => {
		const { container } = render(marquee({ minItemsPerCopy: 7 }));
		// ceil(7 / 3) = 3 passes per copy, two copies.
		expect(container.querySelectorAll("a")).toHaveLength(items.length * 3 * 2);
		expect(screen.getAllByRole("link")).toHaveLength(items.length);
		const root = container.querySelector(".marquee") as HTMLElement;
		// Duration scales with the cards in one copy: 9 × 4s.
		expect(root.style.getPropertyValue("--marquee-duration")).toBe("36s");
	});

	it("sets direction and a duration that scales with the item count", () => {
		const { container } = render(marquee({ reverse: true }));
		const root = container.querySelector(".marquee") as HTMLElement;
		expect(root).toHaveAttribute("data-direction", "reverse");
		expect(root.style.getPropertyValue("--marquee-duration")).toBe("12s");
	});

	it("pauses every marquee from any pause button", () => {
		render(
			<>
				{marquee()}
				{marquee({ reverse: true })}
			</>,
		);
		const [first, second] = screen.getAllByRole("button", { name: "Pause animations" });
		expect(first).toHaveAttribute("aria-pressed", "false");

		fireEvent.click(first);
		expect(document.documentElement).toHaveAttribute("data-marquee-paused");
		expect(first).toHaveAttribute("aria-pressed", "true");
		expect(second).toHaveAttribute("aria-pressed", "true");

		fireEvent.click(second);
		expect(document.documentElement).not.toHaveAttribute("data-marquee-paused");
		expect(first).toHaveAttribute("aria-pressed", "false");
	});
});
