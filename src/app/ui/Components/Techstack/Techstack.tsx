import TechCard from "./TechCard";

const Techstack: React.FC = () => {
	return (
		<>
			<h2>Tech Stack</h2>
			<div className="stack-container flex flex-wrap flex-row">
				<TechCard />
			</div>
		</>
	);
};

export default Techstack;
