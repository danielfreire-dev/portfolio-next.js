"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/app/i18n/i18n-config";

const LocaleSwitcher = () => {
	const pathname = usePathname();
	const redirectedPathname = (locale: Locale) => {
		if (!pathname) return "/";
		const segments = pathname.split("/");
		segments[1] = locale;
		return segments.join("/");
	};

	return (
		<select name="language" id="language" className={` hover:cursor-pointer`}>
			{i18n.locales.map((locale) => {
				return (
					<option value={locale} key={locale}>
						<Link href={redirectedPathname(locale)}>{locale}</Link>
					</option>
				);
			})}
		</select>
	);
};

export default LocaleSwitcher;
