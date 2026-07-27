import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import WelcomeEmail from "@/lib/EmailTemplate";

// Minimal mock translation function
const mockT = (key: string): string => {
	const map: Record<string, string> = {
		preview: "Welcome to my portfolio!",
		name: "Daniel Freire",
		heading: "Hello",
		intro: "Thank you for reaching out.",
		introduction: "I'm excited to connect with you.",
		happensNext0: "Here's what happens next:",
		happensNext1: "I'll review your message",
		happensNext2: "I'll respond within 2-3 days",
		happensNext3: "We'll discuss your project",
		whileWait0: "While you wait:",
		whileWait1: "Check out my portfolio",
		whileWait2: "Follow me on social media",
		conclusion: "Talk soon!",
		signature: "Best regards,",
		view: "View our",
		privacyPolicy: "privacy policy",
		privacyPolicyUrl: "privacy-policy",
	};
	return map[key] ?? key;
};

describe("EmailTemplate (WelcomeEmail)", () => {
	describe("rendering", () => {
		it("should render without crashing", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container).toBeTruthy();
		});

		it("should contain the recipient name in content", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("John");
			expect(container.textContent).toContain("Doe");
		});

		it("should contain the preview text", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("Welcome to my portfolio!");
		});

		it("should contain the intro text", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("Thank you for reaching out.");
		});

		it("should contain the 'what happens next' section", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("Here's what happens next:");
			expect(container.textContent).toContain("I'll review your message");
		});

		it("should contain the signature", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("Best regards,");
			expect(container.textContent).toContain("Daniel Freire");
		});

		it("should contain the privacy policy link text", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			expect(container.textContent).toContain("privacy policy");
		});

		it("should contain a link to daniel-freire.com", () => {
			const { container } = render(WelcomeEmail(mockT, "John", "Doe"));
			const links = container.querySelectorAll("a");
			const siteLink = Array.from(links).find((l) => {
				const href = l.getAttribute("href");
				if (!href) return false;
				try {
					const parsedUrl = new URL(href, "http://localhost");
					return parsedUrl.hostname === "daniel-freire.com";
				} catch {
					return false;
				}
			});
			expect(siteLink).toBeTruthy();
		});
	});

	describe("with different names", () => {
		it("should contain different first and last names in content", () => {
			const { container } = render(WelcomeEmail(mockT, "Jane", "Smith"));
			expect(container.textContent).toContain("Jane");
			expect(container.textContent).toContain("Smith");
		});
	});
});
