import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RootNotFound from "@/app/not-found";

describe("Root not-found page", () => {
	it("should render 404 heading and return home link", () => {
		render(<RootNotFound />);
		expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
		expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
		const homeLink = screen.getByRole("link", { name: "Go back to homepage" });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute("href", "/");
	});
});
