import Link from "next/link";
import { Dictionary } from "@/src/types";

import "@/src/ui/styles/border.css";

const Cta = ({ dictionary }: { dictionary: Dictionary }) => {
	const getRandomItem = (array: string[]) => {
		if (array.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	};
	return (
		<>
			<Link href="/contact" className="ml-10 mb-1">
				<button className="offset ">
					{getRandomItem(dictionary.cta.button)}
				</button>
			</Link>
		</>
	);
};

export default Cta;
