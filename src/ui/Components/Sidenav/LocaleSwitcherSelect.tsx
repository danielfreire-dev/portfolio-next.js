"use client";

import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface Props {
	children: ReactNode;
	defaultValue: string;
}

export default function LocaleSwitcherSelect({
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
				className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6 hover:cursor-pointer"
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
				aria-label="Select language"
				name="language"
				id="language"
			>
				{children}
			</select>
			{/* eslint-disable-next-line i18next/no-literal-string*/}
			<span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
		</>
	);
}
