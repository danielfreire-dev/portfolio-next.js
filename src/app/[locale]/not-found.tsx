import { type Metadata } from "next";
import NotFoundPage from "@/ui/Components/NotFoundPage";

/**
 * Metadata for the localized 404 page.
 */
export const metadata: Metadata = {
	title: "Page Not Found",
	description: "The page you are looking for does not exist.",
	robots: { index: false, follow: true },
};

/**
 * Localized 404 page rendered for unmatched routes or notFound() calls
 * within a [locale] segment.
 *
 * Rendered within src/app/[locale]/layout.tsx, so it inherits the
 * NextIntlClientProvider and full application shell (Sidenav, theme, etc.).
 */
export default function NotFound() {
	return <NotFoundPage />;
}
