import data from "@/app/ui/JSONs/text.json";

export const Contact = () => {
	const contact = data["en-us"].contact;

	return (
		<>
			<h2>THIS IS CONTACT!</h2>
			<form action="" method="post">
				<label htmlFor="name" className="capitalize">
					{contact.name}
				</label>
				<input type="text" name="name" id="name" />
				<label htmlFor="email" className="capitalize">
					{contact.email}
				</label>
				<input type="email" name="email" id="email" />
				<label htmlFor="telephone" className="capitalize">
					{contact.phone}
				</label>
				<input type="tel" name="telephone" id="telephone" />
				<label htmlFor="message" className="capitalize">
					{contact.message}
				</label>
				<textarea name="message" id="message" rows={2}></textarea>
			</form>
		</>
	);
};

export default Contact;
