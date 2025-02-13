
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv-flow';

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

		await Promise.all([
			registerSubmitButton.click(),
			registerUserResponsePromise(page),
			await expect(registerSubmitButton).toBeDisabled(),
			await expect(message).toHaveAttribute('data-error', 'false')
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
	test('Registering with an already existing email returns an error', async ({ page, context }) => {
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

		await fillRegisterForm(page, {
			preDefinedFields: {
				email: TEST_EMAIL_ADDRESS
			}
		});

		const {
			message,
			submitButton: registerSubmitButton
		} = getRegisterFormLocators(page);

		await Promise.all([
			registerSubmitButton.click(),
			await expect(registerSubmitButton).toBeDisabled(),
			await expect(message).toHaveAttribute('data-error', 'true')
		]);
	});

	// TODO: Add regex for email on backend to make this work
	test('Registering with an invalid email disables te submitbutton', async ({ page, context }) => {
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

		await fillRegisterForm(page, {
			preDefinedFields: {
				email: 'invalid-email-address'
			}
		});

		const {
			message,
			submitButton: registerSubmitButton
		} = getRegisterFormLocators(page);

		await Promise.all([
			await expect(registerSubmitButton).toBeDisabled(),
			await expect(message).toHaveAttribute('data-error', 'true')
		]);
	});

	// TODO: Add regex for password on backend to make this work
	test('Registering with an invalid password disables te submitbutton', async ({ page, context }) => {
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

		await fillRegisterForm(page, {
			preDefinedFields: {
				password: 'invalid-password',
				passwordConfirm: 'invalid-password'
			}
		});

		const {
			message,
			submitButton: registerSubmitButton
		} = getRegisterFormLocators(page);

		await Promise.all([
			await expect(registerSubmitButton).toBeDisabled(),
			await expect(message).toHaveAttribute('data-error', 'true')
		]);
	});

	test('Registering with mismatching passwords disables the submit button', async ({ page, context }) => {
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

		await fillRegisterForm(page, {
			preDefinedFields: {
				password: generateRandomString(6),
				passwordConfirm: generateRandomString(6)
			}
		});

		const {
			message,
			submitButton: registerSubmitButton
		} = getRegisterFormLocators(page);

		await Promise.all([
			await expect(registerSubmitButton).toBeDisabled(),
			await expect(message).toHaveAttribute('data-error', 'true')
		]);
	});
});