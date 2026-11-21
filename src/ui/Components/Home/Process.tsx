import { useTranslations } from "next-intl";

/**
 * "How I work" — the four project steps (discovery, MVP, feedback cycles,
 * launch & care) as a numbered list, so visitors know what to expect before
 * getting in touch.
 */
const Process = () => {
	const t = useTranslations("home.process");
	const steps = t.raw("steps") as { title: string; text: string }[];

	return (
		<section
			aria-labelledby="process-title"
			className="mt-10 mx-4 sm:mx-15">
			<h2
				id="process-title"
				className="text-3xl font-bold text-center">
				{t("title")}
			</h2>

			<ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6 list-none">
				{steps.map((step, index) => (
					<li
						key={step.title}
						className="surface-cards p-4 flex flex-col gap-1">
						<span
							aria-hidden="true"
							className="text-4xl text-(--primary) leading-none">
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3 className="text-xl font-semibold mt-2">{step.title}</h3>
						<p className="text-sm text-(--text-tertiary)">{step.text}</p>
					</li>
				))}
			</ol>
		</section>
	);
};

export default Process;
