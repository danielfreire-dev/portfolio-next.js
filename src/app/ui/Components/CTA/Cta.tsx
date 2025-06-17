import textData from "@/app/ui/JSONs/text.json";
import Link from "next/link";

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
					className="hover:cursor-pointer hover:scale-110 ease-in duration-500"
				>
					{getRandomItem(textData["en-us"].cta.button)}
				</button>
			</Link>
		</>
	);
};

export default Cta;
