import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { TransitionLink } from "../Sidenav/TransitionLink";
import { Suspense } from "react";

/* TODO: Fix btn for smaller screens */

/**
 * Call-to-action button component.
 *
 * Renders a randomised CTA button from a list of translated phrases, linking
 * to the contact page.
 */
const Cta = () => {
  const t = useTranslations("cta");

  /** Returns a random element from the given array, or `null` if empty. */
  const getRandomItem = (array: string[]) => {
    if (array.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  return (
    <>
      <Suspense>
        <TransitionLink href="/contact" inputData="CtA">
          <button className="button-class offset overflow-hidden text-ellipsis whitespace-nowrap hover:cursor-pointer">
            {getRandomItem(t.raw("button"))}
          </button>
        </TransitionLink>
      </Suspense>
    </>
  );
};

export default Cta;
