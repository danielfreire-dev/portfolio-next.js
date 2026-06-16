import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "@/stores/theme-store";

describe("ThemeStore", () => {
	// Reset the store to initial state before each test
	beforeEach(() => {
		// Zustand stores persist between tests by default — reset manually
		const { setValue } = useThemeStore.getState();
		setValue(false);
	});

	describe("initial state", () => {
		it("should default isDarkStore to false (light mode)", () => {
			const { isDarkStore } = useThemeStore.getState();
			expect(isDarkStore).toBe(false);
		});
	});

	describe("toggleTheme", () => {
		it("should toggle isDarkStore from false to true", () => {
			const { toggleTheme } = useThemeStore.getState();
			toggleTheme();
			expect(useThemeStore.getState().isDarkStore).toBe(true);
		});

		it("should toggle isDarkStore from true back to false", () => {
			const { setValue, toggleTheme } = useThemeStore.getState();
			setValue(true);
			toggleTheme();
			expect(useThemeStore.getState().isDarkStore).toBe(false);
		});

		it("should toggle correctly through multiple rapid cycles", () => {
			const { toggleTheme } = useThemeStore.getState();

			toggleTheme(); // false → true
			toggleTheme(); // true → false
			toggleTheme(); // false → true
			toggleTheme(); // true → false
			toggleTheme(); // false → true

			expect(useThemeStore.getState().isDarkStore).toBe(true);
		});
	});

	describe("setValue", () => {
		it("should set isDarkStore to true when called with true", () => {
			const { setValue } = useThemeStore.getState();
			setValue(true);
			expect(useThemeStore.getState().isDarkStore).toBe(true);
		});

		it("should set isDarkStore to false when called with false", () => {
			const { setValue } = useThemeStore.getState();
			setValue(true); // start dark
			setValue(false);
			expect(useThemeStore.getState().isDarkStore).toBe(false);
		});

		it("should maintain the value across multiple identical calls", () => {
			const { setValue } = useThemeStore.getState();
			setValue(true);
			setValue(true);
			setValue(true);
			expect(useThemeStore.getState().isDarkStore).toBe(true);

			setValue(false);
			setValue(false);
			expect(useThemeStore.getState().isDarkStore).toBe(false);
		});
	});

	describe("store identity", () => {
		it("should return the same instance (Zustand singleton)", () => {
			const stateA = useThemeStore.getState();
			const stateB = useThemeStore.getState();
			expect(stateA).toBe(stateB);
		});

		it("should mutate the same store across gets", () => {
			useThemeStore.getState().setValue(true);
			const state = useThemeStore.getState();
			expect(state.isDarkStore).toBe(true);
			expect(useThemeStore.getState().isDarkStore).toBe(true);
		});
	});
});
