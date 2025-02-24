import { randomItemFromArray } from "@/utils/arrays";

import { generateRandomNumber, generateRandomString } from "./common";

export function generateEmailAddress() {
	const name = generateRandomString(5);
	const domainProviders = ['gmail', 'yahoo', 'outlook'];
	const domainEndings = ['com', 'nl', 'org', 'net', 'co', 'io'];

	const domain = randomItemFromArray(domainProviders);
	const ending = randomItemFromArray(domainEndings);

	const emailAddress = `${name}@${domain}.${ending}`;

	return emailAddress;
}

export function generatePassword() {
	// Define character sets as arrays
	const uppercaseLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
	const lowercaseLetters = [...'abcdefghijklmnopqrstuvwxyz'];
	const numbers = [...'0123456789'];
	const specialCharacters = ['-', '!'];

	// Ensure required character types
	const upper = randomItemFromArray(uppercaseLetters);
	const number = randomItemFromArray(numbers);
	const special = randomItemFromArray(specialCharacters);

	// Generate remaining characters to reach at least 8 characters
	const allCharacters = [...uppercaseLetters, ...lowercaseLetters, ...numbers, ...specialCharacters];
	let password = [upper, number, special];

	for (let i = password.length; i < 8; i++) {
		password.push(randomItemFromArray(allCharacters));
	}

	// Shuffle the password to avoid predictable patterns
	return password.sort(() => Math.random() - 0.5).join('');
}

export function generatePhoneNumber() {
	const countryCodes = ['+1', '+31', '+44', '+91', '+61', '+81']; // Common country codes
	const areaCode = generateRandomNumber(100, 999); // 3-digit area code
	const firstPart = generateRandomNumber(100, 999); // First 3 digits
	const secondPart = generateRandomNumber(1000, 9999); // Last 4 digits

	const formats = [
		`${areaCode}-${firstPart}-${secondPart}`,
		`(${areaCode}) ${firstPart}-${secondPart}`,
		`${countryCodes[Math.floor(Math.random() * countryCodes.length)]} ${areaCode}-${firstPart}-${secondPart}`,
	];

	return randomItemFromArray(formats);
}
