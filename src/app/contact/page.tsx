import data from "@/app/ui/JSONs/text.json";

export const Contact = () => {
	const contact = data["en-us"].contact;

	return (
		<>
			<h2>Contact Form</h2>
			<form action="" method="post">
				<div className="name-div">
					<label htmlFor="name" className="capitalize">
						{contact.name}
					</label>
					<input
						type="text"
						name="name"
						id="name"
						className="bg-gray-700 ml-2 my-1"
					/>
				</div>
				<div className="email-div">
					<label htmlFor="email" className="capitalize">
						{contact.email}
					</label>
					<input
						type="email"
						name="email"
						id="email"
						className="bg-gray-700 ml-2 my-1"
					/>
				</div>
				<div className="tel-div">
					<label htmlFor="telephone" className="capitalize">
						{contact.phone}
					</label>
					<input
						type="tel"
						name="telephone"
						id="telephone"
						className="bg-gray-700 ml-2 my-1"
					/>
				</div>
				<div className="message-div flex">
					<label htmlFor="message" className="capitalize">
						{contact.message}
					</label>
					<textarea
						name="message"
						id="message"
						rows={2}
						className="bg-gray-700 ml-2 my-1"
					></textarea>
				</div>
			</form>
		</>
	);
};

export default Contact;
