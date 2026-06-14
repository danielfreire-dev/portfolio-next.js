import NavigationLink from "./NavigationLink";
import { usePathname } from "next/navigation";
import { nanoid } from "nanoid";
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

    const normalizePath = (path: string) => {
      const decoded = decodeURIComponent(path);
      return decoded.replace(/\/+/g, "/").replace(/\/$/, "");
    };

    const isActive = (link: string, currentPath: string) => {
      const normalizedLink = normalizePath(link);
      const normalizedPath = normalizePath(currentPath);
      const localizedLink = normalizePath(`/${lang}${link}`);

      // Special case for home link
      if (link === "/") {
        return normalizedPath === `/${lang}` || normalizedPath === "";
      }

      return (
        normalizedPath === localizedLink ||
        normalizedPath === normalizedLink ||
        normalizedPath.startsWith(`${normalizedLink}/`)
      );
    };

    // Usage in your component:
    const isActiveClass = isActive(data.link, pathname) ? " active" : "";

    return (
      <li
        className={`navLinks${isActiveClass} flex justify-center`}
        key={nanoid()}
      >
        <NavigationLink href={data.link} isOpen={isOpen} setIsOpen={setIsOpen}>
          {data.name}
        </NavigationLink>
      </li>
    );
  });

  return nav;
};

export default NavigationList;
