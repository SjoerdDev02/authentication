export function isValidEmail(email: string) {
	// This regex validates an email format with the following rules:
	// - Starts with 2 to 20 uppercase/lowercase letters or numbers.
	// - Followed by an '@' symbol.
	// - A domain name consisting of 2 to 10 lowercase letters.
	// - A dot ('.') separator.
	// - A top-level domain (TLD) of 2 to 5 lowercase letters.
	const regex = /^[A-Za-z0-9]{2,20}@[a-z]{2,10}\.[a-z]{2,5}$/;

	return regex.test(email);
}

export function isValidPassword(password: string) {
	// This regex validates a password with the following rules:
	// - At least 8 characters long.
	// - Contains at least one uppercase letter.
	// - Contains at least one number.
	// - Contains at least one special character ('-' or '!').
	// - Only allows uppercase/lowercase letters, numbers, and the specified special characters.
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-!])[A-Za-z\d\-!]{8,}$/;

	return regex.test(password);
}
