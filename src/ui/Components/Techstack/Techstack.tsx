import { useTranslations } from "next-intl";
import TechCards from "./TechCards";

const Techstack = () => {
	const tech = useTranslations();
	const title = useTranslations("home");
	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">
				{title("techstack")}
			</h2>
			<div className="stack-container flex flex-wrap flex-row justify-center">
				<TechCards tech={tech.raw("tech")} />
			</div>
		</>
	);
};

export default Techstack;
