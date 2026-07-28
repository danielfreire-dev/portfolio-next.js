import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import NotFoundPage from "@/ui/Components/NotFoundPage";

/**
 * Generates metadata for the 404 page.
 *
 * Sets a descriptive title and instructs search engines not to index
 * this page, preventing soft-404s from appearing in search results.
 */
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Page Not Found",
		description: "The page you are looking for does not exist.",
		robots: { index: false, follow: true },
	};
}

/**
 * Global 404 page rendered for unmatched routes within a locale segment.
 *
 * Next.js renders `not-found.tsx` **outside** the parent layout's React tree,
 * so it must be fully self-sufficient for i18n: load its own messages, set the
 * request locale, and wrap the UI in `NextIntlClientProvider`.
 *
 * Without this, `useTranslations` inside `NotFoundPage` fails and Next.js falls
 * back to its built-in generic 404 page.
 */
export default async function GlobalNotFound({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const messages = await getMessages();

	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}>
			<NotFoundPage />
		</NextIntlClientProvider>
	);
}
