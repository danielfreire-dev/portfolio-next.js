"use client";

import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { switchLocaleHref } from "@/i18n/switchLocaleHref";

/** Props for the desktop locale switcher select component. */
interface Props {
	/** Option elements for each available locale. */
	children: ReactNode;
	/** The currently active locale code. */
	defaultValue: string;
}

/**
 * LocaleSwitcherSelect - Desktop locale selector with page transition support.
 *
 * Renders a native `<select>` element that triggers a locale change via
 * `router.replace()` when the user picks a different language. Includes
 * commented-out page-transition animation logic.
 */
export default function LocaleSwitcherSelect({ children, defaultValue }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	/* function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	} */

	/**
	 * Handles locale selection from the desktop `<select>` dropdown.
	 *
	 * Reads the new locale value from the change event and performs a
	 * client-side navigation via `router.replace` inside `startTransition`
	 * so the UI remains responsive while the new locale's messages load.
	 * Page-transition animation logic is commented out but preserved for
	 * future re-enablement.
	 *
	 * @param event - The change event from the `<select>` element.
	 */
	async function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value as Locale;
		startTransition(() => {
			// Use pathname string directly - next-intl's router will match the
			// resolved pathname against the routing config to find the template
			// and generate the correct localized URL.
			router.replace(
				switchLocaleHref(pathname, params as Record<string, string>, nextLocale) as Parameters<typeof router.replace>[0],
				{ locale: nextLocale },
			);
		});

		/* mainElement?.classList.remove("page-transition");
  await sleep(500); */
	}

	return (
		<>
			<select
				className="appearance-none text-center bg-transparent py-2 my-2 pl-2 pr-6 hover:cursor-pointer hover:bg-(--surface) focus:bg-(--surface) select-class"
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
				aria-label="Select language"
				name="language"
				id="language-sidenav">
				{children}
			</select>
		</>
	);
}
