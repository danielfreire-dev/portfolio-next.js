import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { TransitionLink } from "../Sidenav/TransitionLink";

const Cta = () => {
	const t = useTranslations("cta");

	const getRandomItem = (array: string[]) => {
		if (array.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	};

	return (
		<>
			<TransitionLink href="/contact" inputData="CtA">
				<button className="offset overflow-hidden text-ellipsis whitespace-nowrap hover:cursor-pointer">
					{getRandomItem(t.raw("button"))}
				</button>
			</TransitionLink>
		</>
	);
};

export default Cta;
