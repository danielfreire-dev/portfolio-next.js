"use client";

import { useLocale } from "next-intl";
import CustomSelect from "./CustomSelect";

const LocaleSwitcher = () => {
	const currentLocale = useLocale();

	// Define your available locales with their labels
	const locales = [
		{ value: "en", label: "🇬🇧 English" },
		{ value: "pt", label: "🇵🇹 Português" },
		// Add more locales as needed
	];

	return <CustomSelect defaultValue={currentLocale} locales={locales} />;
};

export default LocaleSwitcher;
