import { Metadata } from "next";
import ClientSideAbout from "./ClientPage";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "About",
};

const About = async () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientSideAbout />
		</Suspense>
	);
};

export default About;
