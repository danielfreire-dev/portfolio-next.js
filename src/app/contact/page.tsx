export const Contact = () => {
	const getRandomItem = (array: string[]) => {
		if (array.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	};

	return (
		<>
			<h2>THIS IS CONTACT!</h2>
		</>
	);
};

export default Contact;
