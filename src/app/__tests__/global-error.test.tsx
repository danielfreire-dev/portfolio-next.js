import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ current: "/en" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import GlobalError from "@/app/global-error";

describe("Global error boundary", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("renders English copy and a home link for /en", () => {
		pathname.current = "/en/about";
		render(<GlobalError error={new Error("boom")} />);
		expect(screen.getByRole("heading", { name: "something went wrong!" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "reload the page" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Go back to homepage" })).toHaveAttribute("href", "/en");
	});

	it("uses the locale from the URL", () => {
		pathname.current = "/de/dienstleistungen";
		render(<GlobalError error={new Error("boom")} />);
		expect(screen.getByRole("heading", { name: "etwas ist schiefgelaufen!" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Zurück zur Startseite" })).toHaveAttribute("href", "/de");
	});

	it("falls back to the default locale for unknown paths", () => {
		pathname.current = "/xx/whatever";
		render(<GlobalError error={new Error("boom")} />);
		expect(screen.getByRole("link", { name: "Go back to homepage" })).toHaveAttribute("href", "/en");
	});

	it("shows the error digest when present", () => {
		pathname.current = "/en";
		render(<GlobalError error={Object.assign(new Error("boom"), { digest: "abc123" })} />);
		expect(screen.getByText("Error Digest: abc123")).toBeInTheDocument();
	});
});
