import textData from "@/app/ui/JSONs/text.json";
import Link from "next/link";
import { SidenavProps } from "../../types";

const Cta = () => {
	const getRandomItem = (array: string[]) => {
		if (array.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	};
	return (
		<>
			<Link href="/contact">
				<button
					type="button"
					className="hover:cursor-pointer hover:scale-110 ease-in duration-500 text-gray-950 bg-orange-500 pl-1 py-2 pr-2"
				>
					{getRandomItem(textData["en-US"].cta.button)}
				</button>
			</Link>
		</>
	);
};

export default Cta;
