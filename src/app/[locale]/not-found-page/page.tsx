import type { Metadata } from "next";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import NotFoundPage from "@/ui/Components/NotFoundPage";

/**
 * Localized "page not found" page, served for unknown URLs.
 *
 * The middleware rewrites unknown URLs here with a 404 status (see
 * `NOT_FOUND_PATH` in `src/middleware.ts`).  Unlike `notFound()` in a dynamic
 * route, this is a normal, pre-rendered page, so the 404 response contains
 * the fully server-rendered page inside the site layout.  Direct visits to
 * this path are rewritten with a 404 status as well.
 */
export const metadata: Metadata = {
	title: "Page Not Found",
	description: "The page you are looking for does not exist.",
	robots: { index: false, follow: true },
};

export default function NotFoundRoute({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = use(params);
	setRequestLocale(locale);

	return <NotFoundPage />;
}
