import NavigationLink from "./NavigationLink";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

/** Describes a single navigation link entry from the translation file. */
interface NavLink {
	/** The route path this link points to. */
	link:
		| "/"
		| "/about"
		| "/portfolio"
		| "/contact"
		| "/privacy-policy"
		| "/terms-of-service"
		| "/cookies-policy"
		| "/accessibility-statement"
		| "/sitemap.xml"
		| "/robots.txt"
		| "/404"
		| "/prices";
	/** Display name for the link. */
	name: string;
	/** Whether the sidenav is currently open (for mobile close-on-navigate). */
	isOpen?: boolean;
	/** State setter to close the sidenav after navigation. */
	setIsOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

/**
 * NavigationList - Renders the list of navigation links in the sidenav.
 *
 * Reads link definitions from the `sidenav.links` translation key, determines
 * which link is active based on the current pathname (with locale-aware
 * matching), and renders each as a `NavigationLink` inside an `<li>`.
 */
const NavigationList = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}) => {
	const pathname = usePathname();
	const t = useTranslations("sidenav");

	const nav = t.raw("links").map((data: NavLink) => {
		const lang = pathname.split("/")[1];

		/**
		 * Normalises a URL path for reliable comparison.
		 *
		 * Decodes any percent-encoded characters, collapses repeated
		 * slashes, and strips trailing slashes so paths that differ
		 * only in encoding or formatting still match correctly.
		 *
		 * @param path - The raw path string.
		 * @returns The normalised path.
		 */
		const normalizePath = (path: string) => {
			const decoded = decodeURIComponent(path);
			return decoded.replace(/\/+/g, "/").replace(/\/$/, "");
		};

		/**
		 * Determines whether a navigation link matches the current URL.
		 *
		 * Performs locale-aware path comparison: prepends the current
		 * locale segment to the link path and normalises both before
		 * comparing. The home link (`/`) is treated as a special case
		 * that matches the bare locale path (e.g., `/en`). Nested
		 * routes match via `startsWith` so that `/services/slug` is
		 * highlighted when `/services` is active.
		 *
		 * @param link        - The navigation link path from the config.
		 * @param currentPath - The current browser URL pathname.
		 * @returns `true` if the link should be marked active.
		 */
		const isActive = (link: string, currentPath: string) => {
			const normalizedLink = normalizePath(link);
			const normalizedPath = normalizePath(currentPath);
			const localizedLink = normalizePath(`/${lang}${link}`);

			if (link === "/") {
				return normalizedPath === `/${lang}` || normalizedPath === "";
			}

			return (
				normalizedPath === localizedLink ||
				normalizedPath === normalizedLink ||
				normalizedPath.startsWith(`${normalizedLink}/`)
			);
		};

		const isActiveClass = isActive(data.link, pathname) ? " active" : "";

		return (
			<li
				className={`navLinks${isActiveClass} flex justify-center`}
				key={data.link}>
				<NavigationLink
					href={data.link}
					isOpen={isOpen}
					setIsOpen={setIsOpen}>
					{data.name}
				</NavigationLink>
			</li>
		);
	});

	return nav;
};

export default NavigationList;
