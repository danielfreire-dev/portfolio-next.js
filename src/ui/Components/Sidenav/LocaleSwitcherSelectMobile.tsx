"use client";

import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface Props {
	children: ReactNode;
	defaultValue: string;
}

export default function LocaleSwitcherSelectMobile({
	children,
	defaultValue,
}: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

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
				id="language"
			>
				{children}
			</select>
		</>
	);
}
