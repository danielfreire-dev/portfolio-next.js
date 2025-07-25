import { Dictionary } from "@/src/types";
import "@/src/ui/styles/border.css";

const ContactForm = ({ contact }: { contact: Dictionary["contact"] }) => {
	return (
		<>
			<form action="" method="post" className="mx-auto ">
				<div className="name-div flex">
					<section className="flex flex-col">
						<label htmlFor="firstName" className="capitalize">
							{contact.firstName}
						</label>
						<input
							type="text"
							name="name"
							id="name"
							className="bg-gray-700 ml-2 my-1"
						/>
					</section>
					<section className="flex flex-col">
						<label htmlFor="lastName" className="capitalize">
							{contact.lastName}
						</label>
						<input
							type="text"
							name="lastName"
							id="lastName"
							className="bg-gray-700 ml-2 my-1"
						/>
					</section>
				</div>
				<div className="contacts-div flex">
					<section className="flex flex-col">
						<label htmlFor="email" className="capitalize">
							{contact.email}
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="bg-gray-700 ml-2 my-1"
						/>
					</section>
					<section className="flex flex-col">
						<label htmlFor="telephone" className="capitalize">
							{contact.phone}
						</label>
						<input
							type="tel"
							name="telephone"
							id="telephone"
							className="bg-gray-700 ml-2 my-1"
							required
							aria-autocomplete="both"
							aria-required="true"
						/>
					</section>
				</div>
				<section className="message-div flex flex-col">
					<label htmlFor="message" className="capitalize">
						{contact.message}
					</label>
					<textarea
						name="message"
						id="message"
						rows={4}
						cols={40}
						required
						aria-autocomplete="none"
						aria-required="true"
						className="bg-gray-700 ml-2 my-1"
					/>
				</section>
				<section className="flex justify-center mx-auto my-1.5 ">
					<button type="submit" className="raise   capitalize">
						{contact.btn}
					</button>
				</section>
			</form>
		</>
	);
};

export default ContactForm;
