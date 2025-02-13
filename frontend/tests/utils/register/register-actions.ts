import { Page } from "@playwright/test";

import { generateRandomString } from "../common";
import { generateEmailAddress, generatePassword } from "../mock-data";
import { getRegisterFormLocators } from "./register-locators";

type fillRegisterFormOptions = {
	preDefinedFields?: {
		name?: string;
		email?: string;
		password?: string;
		passwordConfirm?: string;
	};
}

export async function fillRegisterForm(page: Page, options?: fillRegisterFormOptions) {
	const name = options?.preDefinedFields?.name || generateRandomString(10);
	const email = options?.preDefinedFields?.email || generateEmailAddress();
	const password = options?.preDefinedFields?.password || generatePassword();
	const passwordConfirm = options?.preDefinedFields?.passwordConfirm || password;

	const {
		nameInput,
		emailInput,
		passwordInput,
		passwordConfirmInput,
	} = getRegisterFormLocators(page);

	await nameInput.fill(name);
	await emailInput.fill(email);
	await passwordInput.fill(password);
	await passwordConfirmInput.fill(passwordConfirm);

	return {
		name,
		email,
		password
	};
}