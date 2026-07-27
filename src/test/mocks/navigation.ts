/**
 * Mock helpers for Next.js navigation primitives.
 *
 * Provides controllable mock implementations for `next/navigation` and
 * `@/i18n/navigation` hooks so tests can assert navigation behaviour
 * without a real router.
 */

import { vi } from "vitest";

// ---- Mock state (resettable between tests) ----

let mockPathname = "/en";
let mockParams: Record<string, string> = { locale: "en" };
let mockSearchParams = new URLSearchParams();

/** Reset all navigation mock state to defaults. Call in `beforeEach`. */
export function resetNavigationMocks() {
	mockPathname = "/en";
	mockParams = { locale: "en" };
	mockSearchParams = new URLSearchParams();
}

/** Override the current mock pathname. */
export function setMockPathname(pathname: string) {
	mockPathname = pathname;
}

/** Override the current mock params. */
export function setMockParams(params: Record<string, string>) {
	mockParams = params;
}

/** Override the current mock search params. */
export function setMockSearchParams(params: Record<string, string>) {
	mockSearchParams = new URLSearchParams(params);
}

// ---- Spy functions ----

export const mockRouterPush = vi.fn();
export const mockRouterReplace = vi.fn();
export const mockRouterBack = vi.fn();
export const mockRouterForward = vi.fn();
export const mockRouterRefresh = vi.fn();
export const mockRouterPrefetch = vi.fn();
export const mockNotFound = vi.fn();
export const mockRedirect = vi.fn();

/** Reset all spy call histories. Call in `beforeEach`. */
export function resetNavigationSpies() {
	mockRouterPush.mockReset();
	mockRouterReplace.mockReset();
	mockRouterBack.mockReset();
	mockRouterForward.mockReset();
	mockRouterRefresh.mockReset();
	mockRouterPrefetch.mockReset();
	mockNotFound.mockReset();
	mockRedirect.mockReset();
}

// ---- next/navigation mocks ----

export const mockNextNavigation = {
	usePathname: () => mockPathname,
	useRouter: () => ({
		push: mockRouterPush,
		replace: mockRouterReplace,
		back: mockRouterBack,
		forward: mockRouterForward,
		refresh: mockRouterRefresh,
		prefetch: mockRouterPrefetch,
	}),
	useParams: () => mockParams,
	useSearchParams: () => mockSearchParams,
	notFound: mockNotFound,
	redirect: mockRedirect,
	// Link component — renders a simple <a> tag in tests
	Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => {
		// Simple <a> fallback for tests
		const { default: React } = require("react");
		return React.createElement("a", { href, ...props }, children);
	},
};

// ---- @/i18n/navigation mocks (wraps next-intl/navigation) ----

export const mockI18nNavigation = {
	usePathname: () => mockPathname,
	useRouter: () => ({
		push: mockRouterPush,
		replace: mockRouterReplace,
		back: mockRouterBack,
		forward: mockRouterForward,
		refresh: mockRouterRefresh,
		prefetch: mockRouterPrefetch,
	}),
	Link: mockNextNavigation.Link,
	redirect: mockRedirect,
	getPathname: () => mockPathname,
};
