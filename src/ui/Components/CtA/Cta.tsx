import Link from "next/link";

import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";

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
			<Link href="/contact" className="size-min ml-10 mb-1 ">
				<button className="offset overflow-hidden text-ellipsis whitespace-nowrap hover:cursor-pointer">
					{getRandomItem(t.raw("button"))}
				</button>
			</Link>
		</>
	);
};

export default Cta;
