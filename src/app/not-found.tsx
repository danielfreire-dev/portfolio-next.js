import type { Metadata } from "next";
import Link from "next/link";
import "./[locale]/globals.css";

export const metadata: Metadata = {
	title: "Page Not Found",
	description: "The page you are looking for does not exist.",
	robots: { index: false, follow: true },
};

/**
 * Root fallback 404 page for requests outside the [locale] boundary,
 * invalid locales, or requests not handled by next-intl middleware.
 *
 * In Next.js App Router, because the root layout is inside [locale],
 * the root not-found component must provide its own <html> and <body> tags.
 */
export default function RootNotFound() {
	const themeScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");var isDark=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(isDark){d.classList.add("dark")}else{d.classList.remove("dark")}d.classList.add("theme-ready")}catch(e){document.documentElement.classList.add("theme-ready")}})();`;

	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="antialiased flex min-h-screen items-center justify-center bg-(--background) text-(--text) selection:bg-(--primary) selection:text-(--selector-txt)">
				<div className="flex flex-col items-center text-center px-4 max-w-md">
					<h1 className="text-4xl font-bold capitalize">404 - Page Not Found</h1>
					<h2 className="text-xl font-semibold mt-3 capitalize">Something went wrong!</h2>
					<p className="mt-2 text-(--text-secondary)">
						Looks like you got lost. Don&apos;t worry, it happens to the best of us.
					</p>
					<p className="mt-2 text-sm text-(--text-tertiary)">
						If you believe there should be a page here, please contact{" "}
						<a
							className="underline"
							href="mailto:webmaster@daniel-freire.com">
							webmaster@daniel-freire.com
						</a>
					</p>
					<Link
						href="/"
						className="mt-6 px-5 py-2.5 rounded-md bg-(--primary) text-(--selector-txt) font-medium hover:opacity-90 transition-opacity">
						Go back to homepage
					</Link>
				</div>
			</body>
		</html>
	);
}
