
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv-flow';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { extractOtcFromMessage, getAllEmails, getMessageByRecipient } from "./utils/email";
import { getOTCFormLocators } from './utils/otc/otc-locators';
import { fillRegisterForm } from './utils/register/register-actions';
import { getRegisterFormLocators } from './utils/register/register-locators';
import { registerUserResponsePromise } from './utils/register/register-requests';

test.describe('register', () => {
	test('Register using an unique email and a valid password', async ({ page, context }) => {
		const cookies = [
			{
			  name: 'language',
			  value: 'EN',
			  domain: 'localhost',  // Domain for localhost
			  path: '/',
			  secure: false,  // No need to be secure for localhost (unless using https)
			  httpOnly: false,
			},
			{
			  name: 'theme',
			  value: 'dark',
			  domain: 'localhost',
			  path: '/',
			  secure: false,
			  httpOnly: false,
			},
		  ];

		// Set cookies
		await context.addCookies(cookies);

		await page.goto(pages.Register.path);

		await page.waitForURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Register.path}`);

		const { email } = await fillRegisterForm(page);

		const {
			message,
			submitButton: registerSubmitButton
		} = getRegisterFormLocators(page);

		await expect(registerSubmitButton).toBeDisabled();

		await Promise.all([
			registerSubmitButton.click(),
			registerUserResponsePromise(page)
		]);

		await expect(registerSubmitButton).toBeDisabled();
		await expect(message).toHaveAttribute('data-error', 'false');

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, email);
		const otc = extractOtcFromMessage(filteredEmail);

		await page.goto(`${pages.Otc.path}?otc=${otc}`);

		const { submitButton: otcSubmitButton } = getOTCFormLocators(page);

		await otcSubmitButton.click();

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);
	});
});