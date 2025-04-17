import { TranslationKey } from "@/types/translations";

export function isValidEmail(email: string) {
	// This regex validates an email format with the following rules:
	// - Starts with 2 to 20 uppercase/lowercase letters, numbers, dots (.), or hyphens (-).
	// - Followed by an '@' symbol.
	// - A domain name consisting of 2 to 10 lowercase letters.
	// - A dot ('.') separator.
	// - A top-level domain (TLD) of 2 to 5 lowercase letters.
	const regex = /^[A-Za-z0-9.-]{2,20}@[a-z]{2,10}\.[a-z]{2,5}$/;

	return regex.test(email);
}

export function getEmailFeedbackMessage(email: string): TranslationKey | null {
	if (/[^A-Za-z0-9.@-]/.test(email)) {
		return 'Authentication.Errors.invalidEmailCharacters';
	} else if (!email.includes('@')) {
		return 'Authentication.Errors.missingAtSymbol';
	} else if (!/^[A-Za-z0-9.-]{2,20}/.test(email)) {
		return 'Authentication.Errors.invalidEmailStart';
	} else if (!/^[A-Za-z0-9.-]{2,20}@[a-z]{2,10}/.test(email)) {
		return 'Authentication.Errors.invalidDomainName';
	} else if (!/\.[a-z]{2,5}$/.test(email)) {
		return 'Authentication.Errors.missingOrInvalidTLD';
	} else {
		return null;
	}
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

export function getPasswordFeedbackMessage(password: string): TranslationKey | null {
	if (password.length < 8) {
		return 'Authentication.Errors.passwordTooShort';
	} else if (!/[A-Z]/.test(password)) {
		return 'Authentication.Errors.missingUppercase';
	} else if (!/\d/.test(password)) {
		return 'Authentication.Errors.missingNumber';
	} else if (!/[-!]/.test(password)) {
		return 'Authentication.Errors.missingSpecialCharacter';
	} else if (/[^A-Za-z\d\-!]/.test(password)) {
		return 'Authentication.Errors.invalidPasswordCharacters';
	} else {
		return null;
	}
}

export function isValidPhoneNumber(phone: string) {
	// This regex validates a phone number format with the following rules:
	// - Optional '+' followed by country code (1-3 digits).
	// - Optional spaces, dashes, or parentheses.
	// - A sequence of 6 to 15 digits with optional separators.
	const regex = /^\+?\d{1,3}[\s-]?(\(\d{2,4}\)|\d{2,4})[\s-]?\d{2,4}[\s-]?\d{2,6}$/;

	return regex.test(phone);
}

export function getPhoneNumberFeedbackMessage(phone: string): TranslationKey | null {
	if (!/^\+?\d{1,3}?/.test(phone)) {
		return 'Authentication.Errors.invalidPhoneCountryCode';
	} else if (!/\d{10,}/.test(phone.replace(/\D/g, ''))) {
		return 'Authentication.Errors.invalidPhoneLength';
	} else if (/[^0-9\s()+-]/.test(phone)) {
		return 'Authentication.Errors.invalidPhoneCharacters';
	} else {
		return null;
	}
}
