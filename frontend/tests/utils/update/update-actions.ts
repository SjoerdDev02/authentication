import { Page } from "@playwright/test";

import { generateRandomString } from "@/e2e/utils/common";
import { generateEmailAddress, generatePassword, generatePhoneNumber } from "@/e2e/utils/mock-data";
import { getUpdateFormLocators } from "@/e2e/utils/update/update-locators";

type fillUpdateFormUserDetailsOptions = {
	preDefinedFields?: {
		name?: string;
		phone?: string;
		email?: string;
		emailConfirm?: string;
	};
}

type fillUpdateFormPasswordOptions = {
	preDefinedFields?: {
		name?: string;
		phone?: string;
		email?: string;
		emailConfirm?: string;
		password?: string;
		passwordConfirm?: string;
	};
}

export async function fillUpdateFormUserDetails(page: Page, options?: fillUpdateFormUserDetailsOptions) {
	const name = options?.preDefinedFields?.name || generateRandomString(10);
	const phone = options?.preDefinedFields?.phone || generatePhoneNumber();
	const email = options?.preDefinedFields?.email || generateEmailAddress();
	const emailConfirm = options?.preDefinedFields?.emailConfirm || email;

	const {
		nameInput,
		phoneInput,
		emailInput,
		emailConfirmInput,
	} = getUpdateFormLocators(page);

	await nameInput.fill(name);
	await phoneInput.fill(phone);
	await emailInput.fill(email);
	await emailConfirmInput.fill(emailConfirm);

	return {
		name,
		phone,
		email
	};
}

export async function fillUpdateFormPassword(page: Page, options?: fillUpdateFormPasswordOptions) {
	const password = options?.preDefinedFields?.password || generatePassword();
	const passwordConfirm = options?.preDefinedFields?.passwordConfirm || password;

	const {
		passwordInput,
		passwordConfirmInput
	} = getUpdateFormLocators(page);

	await passwordInput.fill(password);
	await passwordConfirmInput.fill(passwordConfirm);

	return {
		password
	};
}