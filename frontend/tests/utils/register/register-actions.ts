import { Page } from "@playwright/test";

import { generateRandomString } from "../common";
import { generateEmailAddress } from "../mock-data";
import { getRegisterFormLocators } from "./register-locators";

export async function fillRegisterForm(page: Page) {
	const name = generateRandomString(10);
	const email = generateEmailAddress();
	const password = generateRandomString(10);

	const {
		nameInput,
		emailInput,
		passwordInput,
		passwordConfirmInput,
	} = getRegisterFormLocators(page);

	await nameInput.fill(name);
	await emailInput.fill(email);
	await passwordInput.fill(password);
	await passwordConfirmInput.fill(password);

	return {
		name,
		email,
		password
	};
}