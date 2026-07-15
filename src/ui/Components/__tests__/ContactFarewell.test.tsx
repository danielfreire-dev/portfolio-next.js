import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ContactFarewell from "@/ui/Components/ContactFarewell";

// Mock next-intl — must include NextIntlClientProvider for renderWithProviders
vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const messages: Record<string, Record<string, string>> = {
      contact: {
        "farewell.title": "Thank You!",
        "farewell.text": "We'll be in touch soon.",
      },
    };
    return (key: string) =>
      (namespace && messages[namespace]?.[key]) ?? key;
  },
  NextIntlClientProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children as React.ReactElement,
}));

describe("ContactFarewell", () => {
  describe("when submitted is false", () => {
    beforeEach(() => {
      renderWithProviders(<ContactFarewell submitted={false} />);
    });

    it("should render the container with 'hidden' CSS class", () => {
      const container = screen.getByText("Thank You!").closest("div");
      expect(container).toHaveClass("hidden");
    });

    it("should render the farewell title text", () => {
      expect(screen.getByText("Thank You!")).toBeInTheDocument();
    });

    it("should render the farewell body text", () => {
      expect(screen.getByText("We'll be in touch soon.")).toBeInTheDocument();
    });
  });

  describe("when submitted is true", () => {
    beforeEach(() => {
      renderWithProviders(<ContactFarewell submitted />);
    });

    it("should render the container without 'hidden' CSS class", () => {
      const container = screen.getByText("Thank You!").closest("div");
      expect(container).not.toHaveClass("hidden");
    });

    it("should still display the farewell title", () => {
      expect(screen.getByText("Thank You!")).toBeInTheDocument();
    });

    it("should still display the farewell text", () => {
      expect(screen.getByText("We'll be in touch soon.")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should render heading and paragraph semantic elements", () => {
      renderWithProviders(<ContactFarewell submitted />);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });
  });
});
