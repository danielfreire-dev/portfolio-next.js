import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * i18n-aware navigation primitives.
 *
 * Lightweight wrappers around Next.js' navigation APIs that automatically
 * consider the locale routing configuration (pathname prefix, localized
 * pathnames, etc.).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
