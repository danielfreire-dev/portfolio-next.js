import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { TransitionLink } from "../Sidenav/TransitionLink";
import { Suspense } from "react";

/**
 * Returns a random element from the given array, or `null` if empty.
 *
 * Selects a randomised call-to-action button label from the translation file's
 * `button` array so each page load shows a different CTA phrase. This adds
 * visual variety and avoids banner blindness for returning visitors.
 *
 * @param array - The array of button label strings from the translation data.
 * @returns A random string from the array, or `null` if the array is empty.
 */
const getRandomItem = (array: string[]) => {
	if (array.length === 0) {
		return null;
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

/**
 * Call-to-action button component.
 *
 * Renders a randomised CTA button from a list of translated phrases, linking
 * to the contact page. The button label is randomly selected from the
 * translation file's `cta.button` array on every render, so returning users
 * see fresh messaging. Wrapped in Suspense to avoid blocking above-the-fold
 * content while the CTA label resolves.
 *
 * @todo Fix button layout on smaller screens (text overflow / wrapping).
 */
const Cta = () => {
	const t = useTranslations("cta");

	return (
		<>
			<Suspense>
				<TransitionLink
					href="/contact"
					inputData="CtA">
					<button className="button-class offset overflow-hidden text-ellipsis whitespace-nowrap hover:cursor-pointer">
						{getRandomItem(t.raw("button"))}
					</button>
				</TransitionLink>
			</Suspense>
		</>
	);
};

export default Cta;
