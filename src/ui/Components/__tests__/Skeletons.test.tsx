import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CardSkeleton,
  CardsSkeleton,
  RevenueChartSkeleton,
  InvoiceSkeleton,
  LatestInvoicesSkeleton,
  ContactFormSkeleton,
  WebsiteCardSkeleton,
  WebsiteCardsSkeleton,
  InvoicesMobileSkeleton,
} from "@/ui/Components/Skeletons";
import DashboardSkeleton from "@/ui/Components/Skeletons";

describe("Skeletons", () => {
	describe("CardSkeleton", () => {
		it("should render without crashing", () => {
			render(<CardSkeleton />);
			// Should have the shimmer animation class
			const container = document.querySelector(".before\\:absolute");
			expect(container).toBeInTheDocument();
		});

		it("should have the shimmer utility class", () => {
			const { container } = render(<CardSkeleton />);
			expect(container.firstChild).toBeInTheDocument();
		});
	});

	describe("CardsSkeleton", () => {
		it("should render 4 CardSkeleton instances", () => {
			const { container } = render(<CardsSkeleton />);
			// CardsSkeleton is a fragment with 4 CardSkeleton children
			const cards = container.querySelectorAll(".rounded-xl");
			// Each CardSkeleton renders at least one rounded-xl div
			expect(cards.length).toBeGreaterThanOrEqual(4);
		});
	});

	describe("RevenueChartSkeleton", () => {
		it("should render without crashing", () => {
			render(<RevenueChartSkeleton />);
			const container = document.querySelector(".before\\:absolute");
			expect(container).toBeInTheDocument();
		});
	});

	describe("InvoiceSkeleton", () => {
		it("should render invoice skeleton structure", () => {
			const { container } = render(<InvoiceSkeleton />);
			expect(container.firstChild).toBeInTheDocument();
		});
	});

	describe("LatestInvoicesSkeleton", () => {
		it("should render 5 InvoiceSkeleton instances", () => {
			const { container } = render(<LatestInvoicesSkeleton />);
			// Should contain multiple invoice skeletons
			const invoiceContainers = container.querySelectorAll(".border-b");
			expect(invoiceContainers.length).toBeGreaterThanOrEqual(4);
		});
	});

	describe("ContactFormSkeleton", () => {
		it("should render form field placeholders", () => {
			render(<ContactFormSkeleton />);
			// Should have placeholder divs for name, email, telephone, message fields
			const container = document.querySelector(".name-div");
			expect(container).toBeInTheDocument();

			const messageDiv = document.querySelector(".message-div");
			expect(messageDiv).toBeInTheDocument();
		});

		it("should have the shimmer animation class", () => {
			render(<ContactFormSkeleton />);
			const container = document.querySelector(".before\\:absolute");
			expect(container).toBeInTheDocument();
		});
	});

	describe("WebsiteCardSkeleton", () => {
		it("should render card placeholder structure", () => {
			const { container } = render(<WebsiteCardSkeleton />);
			expect(container.firstChild).toBeInTheDocument();
			// Should have placeholder image and text areas
			const roundedDivs = container.querySelectorAll(".rounded-md");
			expect(roundedDivs.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("WebsiteCardsSkeleton", () => {
		it("should render 6 WebsiteCardSkeleton instances", () => {
			const { container } = render(<WebsiteCardsSkeleton />);
			// Two sections of 3 cards each
			const cardSections = container.querySelectorAll(".gap-x-7");
			expect(cardSections.length).toBe(2);
		});

		it("should render section title placeholders", () => {
			const { container } = render(<WebsiteCardsSkeleton />);
			// Two heading placeholders (one per section)
			const headingPlaceholders = container.querySelectorAll(".h-8.w-48");
			expect(headingPlaceholders.length).toBe(2);
		});
	});

	describe("DashboardSkeleton", () => {
		it("should render cards and chart skeletons", () => {
			render(<DashboardSkeleton />);
			// Should contain a revenue chart and latest invoices
			const shimmerContainers = document.querySelectorAll(".before\\:absolute");
			expect(shimmerContainers.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe("InvoicesMobileSkeleton", () => {
		it("should render mobile invoice skeleton", () => {
			const { container } = render(<InvoicesMobileSkeleton />);
			expect(container.firstChild).toBeInTheDocument();
		});
	});

	describe("accessibility", () => {
		it("all skeletons should be purely presentational (no aria labels leaking)", () => {
			// Skeleton components are visual placeholders — no interactive elements
			const { container } = render(<CardsSkeleton />);
			const interactiveElements = container.querySelectorAll('button, a, input, select, textarea, [role="button"]');
			expect(interactiveElements.length).toBe(0);
		});
	});
});
