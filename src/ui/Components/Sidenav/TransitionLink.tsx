"use client";

import React, { ComponentProps, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { set } from "node_modules/cypress/types/lodash";
import path from "path";
/* import posthog from "posthog-js"; */

/** Identifies the origin of the click for analytics / transition handling. */
type onClickCmdProps = "CtA" | "NavLink" | "MobileNavLink" | "Logo";

/** Props for the TransitionLink component. */
interface TransitionLinkProps extends ComponentProps<typeof Link> {
  /** Optional identifier for the click origin (analytics / transition type). */
  inputData?: onClickCmdProps;
  /** Whether the mobile sidenav is open (to close it after navigation). */
  isOpen?: boolean;
  /** State setter to close the mobile sidenav after navigation. */
  setIsOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  /** Accessible label for the link. */
  ariaLabel?: string;
  /** Tooltip text for the link. */
  title?: string;
  /** Additional accessible details for the link. */
  ariaDetails?: string;
}

/**
 * Sleeps for the given number of milliseconds.
 * Used to delay navigation so the page-transition CSS animation can play.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TransitionLink - A navigation link with a page-transition animation.
 *
 * On click, the component adds a `page-transition` CSS class to `<main>`,
 * waits for the animation to complete (333 ms), then navigates via
 * `router.push()`. On route change, it removes the transition class and
 * closes the mobile sidenav if open.
 */
export const TransitionLink = ({
  children,
  href,
  inputData,
  isOpen,
  setIsOpen,
  ariaLabel,
  title,
  ariaDetails,
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const mainElement = document.getElementById("main");

  useEffect(() => {
    if (setIsOpen && isOpen) {
      setIsOpen((prev) => !prev);
    }
    mainElement?.classList.remove("page-transition");
  }, [pathname]);

  const HandleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (
      (href === "/" && pathname.slice(0, -2) !== href) ||
      (href !== "/" && pathname.slice(3) !== href)
    ) {
      mainElement?.classList.add("page-transition");

      /* defines how fast the transition happens */
      await sleep(333);

      router.push(href as string);
    }
  };

  return (
    <Link
      {...props}
      href={href}
      onClick={HandleTransition}
      aria-label={ariaLabel}
      title={title}
      aria-details={ariaDetails}
      className="truncate"
    >
      {children}
    </Link>
  );
};
