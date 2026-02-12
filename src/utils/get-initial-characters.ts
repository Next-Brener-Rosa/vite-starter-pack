const getInitialsCharacters = (name: string) => {
	const splitName = name.split(" ");
	const initials = splitName
		.map((namePart) => namePart.charAt(0))
		.join("")
		.replace(/[^A-Z]/g, "")
		.slice(0, 2)
		.toUpperCase();
	return initials;
};

export { getInitialsCharacters };
