import { expect, Page } from "@playwright/test";

import { pages } from "@/constants/routes";

import { extractOtcFromMessage, getAllEmails, getMessageByRecipient } from "./email";
import { getOTCFormLocators } from "./otc/otc-locators";
import { fillRegisterForm } from "./register/register-actions";
import { getRegisterFormLocators } from "./register/register-locators";
import { registerUserResponsePromise } from "./register/register-requests";

export async function createUser(page: Page) {
	await page.waitForLoadState('networkidle');

	await page.goto(pages.Register.path);

	const { name, email, password } = await fillRegisterForm(page);

	const { submitButton } = getRegisterFormLocators(page);

	await Promise.all([
		submitButton.click(),
		registerUserResponsePromise(page),
	]);

	const allEmails = await getAllEmails();
	const filteredEmail = getMessageByRecipient(allEmails, email);
	const otc = extractOtcFromMessage(filteredEmail);

	await page.goto(`${pages.Otc.path}?otc=${otc}`);

	const { submitButton: otcSubmitButton } = getOTCFormLocators(page);

	await otcSubmitButton.click();

	await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);

	return {
		name,
		email,
		password
	};
}