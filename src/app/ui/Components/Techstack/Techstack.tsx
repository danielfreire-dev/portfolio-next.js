import TechCard from "./TechCard";

const Techstack: React.FC = () => {
	return (
		<>
			<h2 className=" mx-3 text-3xl font-bold text-center">Tech Stack</h2>
			<div className="stack-container flex flex-wrap flex-row justify-center">
				<TechCard />
			</div>
		</>
	);
};

export default Techstack;
