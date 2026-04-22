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
 * Features click-outside-to-close behavior, keyboard navigation (Enter/Space to
 * toggle, Escape to close), and a loading indicator during locale transitions.
 *
 * @param props.defaultValue - The currently active locale code.
 * @param props.locales      - Array of available locale options.
 */
const CustomSelect = ({ defaultValue, locales }: CustomLocaleSelectProps) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("sidenav");
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router
  const params = useParams();

  // Close dropdown when clicking outside
  // Close the dropdown when the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Handles locale selection: updates the pathname with the new locale. */
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

  const selectedOption = locales.find(
    (locale) => locale.value === selectedLocale,
  );

  // Chevron icon indicating the dropdown can be expanded.
  const chevron = (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  // Spinning loading indicator shown while the locale transition is pending.
  const loadingIndicator = (
    <svg
      className="w-4 h-4 animate-spin text-(--primary)"
      fill="none"
      viewBox="0 0 24 24"
    >
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
    <div className="relative text-center flex items-center" ref={dropdownRef}>
      {/* Custom Select Button */}
      <button
        type="button"
        className="inline-flex justify-center w-full px-3 py-2 text-sm font-medium text-(--text) border-none hover:bg-(--surface) focus:outline-none focus:bg-(--surface) focus:ring-2 focus:ring-(--primary) focus:border-(--primary) hover:text-(--text) transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("select.languageSelectAriaLabel")}
        title={t("select.languageSelectTitle")}
      >
        <span className="flex items-center">
          <span className="mr-2">{selectedOption?.label}</span>
          {isPending ? loadingIndicator : chevron}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-full mb-1 origin-bottom-right bg-(--surface) border border-(--border) shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bottom-full">
          <ul
            className=""
            role="listbox"
            aria-label={t("select.languageSelectAriaLabel")}
          >
            {locales.map((locale) => (
              <li
                key={locale.value}
                role="option"
                aria-selected={locale.value === selectedLocale}
                className={`locale-option block w-full px-4 text-center transition-colors duration-150 cursor-pointer ${
                  locale.value === selectedLocale
                    ? "bg-(--primary) text-(--primary-text)"
                    : "text-(--text) hover:bg-(--surface-hover)"
                }`}
                onClick={() => handleLocaleChange(locale.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLocaleChange(locale.value);
                  }
                }}
                tabIndex={0}
              >
                {locale.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
