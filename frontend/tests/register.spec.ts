
import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from './test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { TEST_EMAIL_ADDRESS } from './constants/common';
import { generateRandomString } from './utils/common';
import { extractOtcFromMessage, getAllEmails, getMessageByRecipient } from "./utils/email";
import { getOTCFormLocators } from './utils/otc/otc-locators';
import { fillRegisterForm } from './utils/register/register-actions';
import { getRegisterFormLocators } from './utils/register/register-locators';
import { registerUserResponsePromise } from './utils/register/register-requests';

const test = base.extend<
{
	registerFormLocators: ReturnType<typeof getRegisterFormLocators>
}>({
  	registerFormLocators: async ({ page }, use) => {
	  const locators = getRegisterFormLocators(page);
	  await use(locators);
  	},
});

test.beforeEach(async ({ page }) => {
	await page.goto(pages.Register.path);

	await page.waitForURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Register.path}`);
});

test.describe('register', () => {
	test('Register using an unique email and a valid password', async ({ page, registerFormLocators }) => {
		const { email } = await fillRegisterForm(page);

		await Promise.all([
			registerFormLocators.submitButton.click(),
			registerUserResponsePromise(page),
			await expect(registerFormLocators.submitButton).toBeDisabled(),
			await expect(registerFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, email);
		const otc = extractOtcFromMessage(filteredEmail);

		await page.goto(`${pages.Otc.path}?otc=${otc}`);

		const { submitButton: otcSubmitButton } = getOTCFormLocators(page);

		await otcSubmitButton.click();

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);
	});

	// TODO: Create and pre-seeded account with test@mail.com to make this work
	test('Registering with an already existing email returns an error', async ({ page, registerFormLocators }) => {
		await fillRegisterForm(page, {
			preDefinedFields: {
				email: TEST_EMAIL_ADDRESS
			}
		});

		await Promise.all([
			registerFormLocators.submitButton.click(),
			await expect(registerFormLocators.submitButton).toBeDisabled(),
			await expect(registerFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});

	// TODO: Add regex for email on backend to make this work
	test('Registering with an invalid email disables te submitbutton', async ({ page, registerFormLocators }) => {
		await fillRegisterForm(page, {
			preDefinedFields: {
				email: 'invalid-email-address'
			}
		});

		await Promise.all([
			await expect(registerFormLocators.submitButton).toBeDisabled(),
			await expect(registerFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});

	// TODO: Add regex for password on backend to make this work
	test('Registering with an invalid password disables te submitbutton', async ({ page, registerFormLocators }) => {
		await fillRegisterForm(page, {
			preDefinedFields: {
				password: 'invalid-password',
				passwordConfirm: 'invalid-password'
			}
		});

		await Promise.all([
			await expect(registerFormLocators.submitButton).toBeDisabled(),
			await expect(registerFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});

	test('Registering with mismatching passwords disables the submit button', async ({ page, registerFormLocators }) => {
		await fillRegisterForm(page, {
			preDefinedFields: {
				password: generateRandomString(6),
				passwordConfirm: generateRandomString(6)
			}
		});

		await Promise.all([
			await expect(registerFormLocators.submitButton).toBeDisabled(),
			await expect(registerFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});
});