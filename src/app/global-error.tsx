"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./[locale]/globals.css";
import { themeScript } from "@/lib/themeScript";
import { routing } from "@/i18n/routing";

interface Props {
	/** The error thrown outside every nested error boundary, with a digest in production. */
	error: Error & { digest?: string };
}

/**
 * Copy for each locale, mirroring `error.errorLoading` and `error.back` in
 * `src/messages/*.json`.
 *
 * Inlined because this boundary replaces the root layout, so the
 * NextIntlClientProvider (and its messages) is not available here.
 * Keep it in sync when those messages change.
 */
const COPY: Record<string, { title: string; body: string; reloadPrefix: string; reload: string; reloadSuffix: string; back: string }> = {
	en: {
		title: "something went wrong!",
		body: "This page ran into an error while loading.",
		reloadPrefix: "You can try to ",
		reload: "reload the page",
		reloadSuffix: ".",
		back: "Go back to homepage",
	},
	pt: {
		title: "algo correu mal!",
		body: "Ocorreu um erro ao carregar esta página.",
		reloadPrefix: "Pode tentar ",
		reload: "recarregar a página",
		reloadSuffix: ".",
		back: "Voltar para a página inicial",
	},
	da: {
		title: "noget gik galt!",
		body: "Der opstod en fejl, da siden skulle indlæses.",
		reloadPrefix: "Du kan prøve at ",
		reload: "genindlæse siden",
		reloadSuffix: ".",
		back: "Gå tilbage til forsiden",
	},
	pl: {
		title: "coś poszło nie tak!",
		body: "Podczas ładowania tej strony wystąpił błąd.",
		reloadPrefix: "Możesz spróbować ",
		reload: "przeładować stronę",
		reloadSuffix: ".",
		back: "Wróć do strony głównej",
	},
	de: {
		title: "etwas ist schiefgelaufen!",
		body: "Beim Laden dieser Seite ist ein Fehler aufgetreten.",
		reloadPrefix: "Sie können versuchen, die Seite ",
		reload: "neu zu laden",
		reloadSuffix: ".",
		back: "Zurück zur Startseite",
	},
	cs: {
		title: "něco se pokazilo!",
		body: "Při načítání této stránky došlo k chybě.",
		reloadPrefix: "Můžete zkusit ",
		reload: "stránku znovu načíst",
		reloadSuffix: ".",
		back: "Zpět na domovskou stránku",
	},
};

/** Reads the locale from the first path segment, falling back to the default locale. */
function localeFromPath(pathname: string | null): string {
	const segment = pathname?.split("/")[1] ?? "";
	return (routing.locales as readonly string[]).includes(segment) ? segment : routing.defaultLocale;
}

/**
 * Last-resort error boundary for the whole app.
 *
 * `[locale]/error.tsx` cannot catch errors thrown by `[locale]/layout.tsx`
 * itself (sidenav, locale switcher, cookie banner, providers). Without this
 * file those errors show Next's bare "Application error" screen.
 *
 * It replaces the root layout when active, so it renders its own `<html>`
 * and `<body>`. "Reload" does a full page load instead of `reset()`: the
 * usual causes at this level (a stale or missing chunk after a deploy, a
 * broken provider) are not fixed by re-rendering the same client bundle.
 */
export default function GlobalError({ error }: Props) {
	const locale = localeFromPath(usePathname());
	const copy = COPY[locale] ?? COPY.en;

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html
			lang={locale}
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<meta
					name="robots"
					content="noindex"
				/>
			</head>
			<body className="antialiased flex min-h-screen items-center justify-center bg-(--background) text-(--text) selection:bg-(--primary) selection:text-(--selector-txt)">
				<main className="flex flex-col items-center text-center px-4 max-w-md">
					<h1 className="text-2xl font-bold first-letter:uppercase">{copy.title}</h1>
					<p className="mt-4">{copy.body}</p>
					<p className="mt-4">
						{copy.reloadPrefix}
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="text-(--primary-text) underline underline-offset-2 hover:opacity-80 cursor-pointer font-medium">
							{copy.reload}
						</button>
						{copy.reloadSuffix}
					</p>
					<a
						href={`/${locale}`}
						className="mt-6 underline underline-offset-2 hover:opacity-80">
						{copy.back}
					</a>
					{error?.digest && (
						// eslint-disable-next-line i18next/no-literal-string
						<p className="mt-4 text-xs font-mono text-(--text-tertiary)">Error Digest: {error.digest}</p>
					)}
				</main>
			</body>
		</html>
	);
}
