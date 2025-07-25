/* eslint-disable i18next/no-literal-string */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/src/i18n/i18n-config";

const LocaleSwitcher = () => {
	const pathname = usePathname();
	const router = useRouter();

	const redirectedPathname = (locale: Locale) => {
		if (!pathname) return "/";
		const segments = pathname.split("/");
		segments[1] = locale;
		return segments.join("/");
	};

	const currentLocale =
		(pathname?.split("/")[1] as Locale) || i18n.defaultLocale;

	const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocale = e.target.value as Locale;
		router.push(redirectedPathname(newLocale));
	};

	return (
		<select
			value={currentLocale}
			onChange={handleLocaleChange}
			aria-label="Select language"
			name="language"
			id="language"
			className={` hover:cursor-pointer`}
		>
			{i18n.locales.map((locale) => {
				return (
					<option value={locale} key={locale} className="capitalize">
						{locale === "en" ? "🇺🇸 English" : "🇵🇹 Português"}
					</option>
				);
			})}
		</select>
	);
};

export default LocaleSwitcher;
