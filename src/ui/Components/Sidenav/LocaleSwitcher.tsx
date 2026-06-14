"use client";

import { useLocale } from "next-intl";
import CustomSelect from "./CustomSelect";

/**
 * LocaleSwitcher - Desktop language selector component.
 *
 * Retrieves the current locale via `useLocale()` and passes it along with the
 * available locale options to the `CustomSelect` dropdown.
 */
const LocaleSwitcher = () => {
  const currentLocale = useLocale();

  // Define your available locales with their labels
  const locales = [
    { value: "en", label: "🇬🇧 English" },
    { value: "pt", label: "🇵🇹 Português" },
    { value: "dk", label: "🇩🇰 Dansk" },
    { value: "pl", label: "🇵🇱 Polski" },
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "cz", label: "🇨🇿 Český" },

    // Add more locales as needed
  ];

  return <CustomSelect defaultValue={currentLocale} locales={locales} />;
};

export default LocaleSwitcher;
