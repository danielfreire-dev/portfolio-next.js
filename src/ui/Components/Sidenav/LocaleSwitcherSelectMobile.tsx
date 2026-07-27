"use client";

import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Props for the mobile locale switcher select component. */
interface Props {
	/** Option elements for each available locale. */
	children: ReactNode;
	/** The currently active locale code. */
	defaultValue: string;
}

/**
 * LocaleSwitcherSelectMobile - Mobile locale selector.
 *
 * Renders a native `<select>` element (visible only on small screens via
 * `lg:hidden`) that triggers a locale change when the user picks a different
 * language.
 */
export default function LocaleSwitcherSelectMobile({ children, defaultValue }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	/**
	 * Handles locale selection from the mobile `<select>` dropdown.
	 *
	 * Reads the new locale value from the change event and performs a
	 * client-side navigation via `router.replace` inside `startTransition`
	 * so the UI remains responsive while the new locale's messages load.
	 *
	 * @param event - The change event from the `<select>` element.
	 */
	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value as Locale;
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			);
		});
	}

	return (
		<>
			<select
				className="lg:hidden bg-(--background) hover:cursor-pointer select-class"
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
				aria-label="Select language"
				name="language"
				id="language">
				{children}
			</select>
		</>
	);
}
