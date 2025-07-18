import { Metadata } from "next";
import ContactForm from "./ContactForm";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Contact",
};

const Contact = () => {
	return (
		<>
			<h2>Contact</h2>{" "}
			<Suspense fallback={<div>Loading...</div>}>
				<ContactForm />
			</Suspense>
		</>
	);
};

export default Contact;
