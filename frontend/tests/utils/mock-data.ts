import { randomItemFromArray } from "@/utils/arrays";

import { generateRandomString } from "./common";

export function generateEmailAddress() {
	const name = generateRandomString(5);
	const domainProviders = ['gmail', 'yahoo', 'outlook'];
	const domainEndings = ['com', 'nl', 'org', 'net', 'co', 'io'];

	const domain = randomItemFromArray(domainProviders);
	const ending = randomItemFromArray(domainEndings);

	const emailAddress = `${name}@${domain}.${ending}`;

	return emailAddress;
}