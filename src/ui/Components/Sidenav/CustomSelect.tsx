"use client";

import { useState, useRef, useEffect } from "react";
import { useTransition } from "react";
import { useTranslations } from "next-intl"; // Make sure useRouter is imported
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

interface CustomLocaleSelectProps {
	defaultValue: string;
	locales: Array<{ value: string; label: string }>;
}

/**
 * CustomSelect - A styled dropdown for selecting a locale/language.
 *
 * Built as a disclosure (WAI-ARIA APG): a toggle `<button aria-expanded>` that
 * reveals a list of native buttons, so Tab / Enter / Space work without custom
 * key handling. Escape closes the list and returns focus to the toggle; the
 * list also closes on outside click or when focus leaves the widget. Each
 * language name carries its own `lang` (WCAG 3.1.2) and the flag emoji is
 * hidden from screen readers. A loading indicator replaces the chevron during
 * locale transitions.
 * Navigation uses `router.replace` inside `startTransition` so the UI stays
 * responsive while the new locale's messages are loaded.
 *
 * @param props.defaultValue - The currently active locale code.
 * @param props.locales      - Array of available locale options.
 */
const CustomSelect = ({ defaultValue, locales }: CustomLocaleSelectProps) => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedLocale, setSelectedLocale] = useState(defaultValue);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const t = useTranslations("sidenav");
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	/**
	 * Handles locale selection by updating the URL pathname with the new locale.
	 *
	 * Uses `router.replace` inside `startTransition` to avoid blocking the UI
	 * while the new locale's message bundle is loaded. The `@ts-expect-error`
	 * directive suppresses a TypeScript mismatch between the dynamic `params`
	 * shape and the typed route path — at runtime these always align because
	 * the current route's params and pathname come from the same URL.
	 */
	const handleLocaleChange = (nextLocale: string) => {
		setSelectedLocale(nextLocale);
		setIsOpen(false);

		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			);
		});
	};

	const selectedOption = locales.find((locale) => locale.value === selectedLocale);

	/** Escape closes the list and returns focus to the toggle (without also closing the mobile sidenav). */
	const closeOnEscape = (e: React.KeyboardEvent) => {
		if (e.key === "Escape" && isOpen) {
			e.stopPropagation();
			setIsOpen(false);
			toggleRef.current?.focus();
		}
	};

	/** Splits "🇬🇧 English" into a decorative flag and the language name. */
	const renderLabel = (label: string, lang: string) => {
		const [flag, ...rest] = label.split(" ");
		return (
			<>
				<span aria-hidden="true">{flag}</span> <span lang={lang}>{rest.join(" ")}</span>
			</>
		);
	};

	const chevron = (
		<svg
			className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	);

	const loadingIndicator = (
		<svg
			className="w-4 h-4 animate-spin text-(--primary)"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true">
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
	return (
		<div
			className="relative text-center flex items-center"
			ref={dropdownRef}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false);
			}}>
			<button
				ref={toggleRef}
				type="button"
				className="inline-flex justify-center w-full px-3 py-2 text-sm font-medium text-(--text) border-none hover:bg-(--surface) focus:outline-none focus:bg-(--surface) focus:ring-2 focus:ring-(--primary) focus:border-(--primary) hover:text-(--text) transition-colors duration-200"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={closeOnEscape}
				disabled={isPending}
				aria-expanded={isOpen}
				aria-controls="locale-options"
				aria-label={t("select.languageSelectAriaLabel")}
				title={t("select.languageSelectTitle")}>
				<span className="flex items-center">
					<span className="mr-2">{selectedOption && renderLabel(selectedOption.label, selectedOption.value)}</span>
					{isPending ? loadingIndicator : chevron}
				</span>
			</button>

			<div
				id="locale-options"
				hidden={!isOpen}
				className="absolute right-0 z-50 w-full mb-1 origin-bottom-right bg-(--surface) border border-(--text-tertiary) shadow-lg bottom-full">
				<ul>
					{locales.map((locale) => {
						const isCurrent = locale.value === selectedLocale;
						return (
							<li key={locale.value}>
								<button
									type="button"
									aria-current={isCurrent ? "true" : undefined}
									onClick={() => handleLocaleChange(locale.value)}
									onKeyDown={closeOnEscape}
									className={`locale-option block w-full px-4 text-center transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--text) ${
										isCurrent ? "bg-(--primary) text-(--on-primary)" : "text-(--text) hover:bg-(--surface-hover)"
									}`}>
									{renderLabel(locale.label, locale.value)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default CustomSelect;
