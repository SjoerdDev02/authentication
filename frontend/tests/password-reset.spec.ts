import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from './test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { createUser } from './utils/auth';
import { extractPasswordResetTokenFromMessage, getAllEmails, getMessageByRecipient } from './utils/email';
import { fillLoginForm, loginUser } from './utils/login/login-actions';
import { getLoginFormLocators } from './utils/login/login-locators';
import { generateEmailAddress, generatePassword } from './utils/mock-data';
import { fillRequestResetPasswordTokenForm, fillResetPasswordForm } from './utils/password-reset/password-reset-actions';
import { getPasswordResetFormLocators } from './utils/password-reset/password-reset-locators';
import { requestResetPasswordTokenResponsePromise, resetPasswordResponsePromise } from './utils/password-reset/password-reset-requests';

const test = base.extend<
{
    user: Awaited<ReturnType<typeof createUser>>,
	passwordResetFormLocators: ReturnType<typeof getPasswordResetFormLocators>
}>({
	user: [async  ({ page }, use) => {
		const user = await createUser(page);

		await use(user);
	}, { auto: true }],
	passwordResetFormLocators: [async  ({ page }, use) => {
	  const locators = getPasswordResetFormLocators(page);

	  await use(locators);
	}, { auto: true }]
});

test.beforeEach(async ({ page }) => {
	await page.goto(pages.ResetPassword.path);

	await page.waitForURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.ResetPassword.path}`);
});

// TODO: Maak 'Resetting password with the same token twice returns an error'

test.describe('password reset', () => {
	test('Reset password using valid email and passwords', async ({ page, user, passwordResetFormLocators }) => {
		await fillRequestResetPasswordTokenForm(page, user);

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			requestResetPasswordTokenResponsePromise(page),
			expect(passwordResetFormLocators.submitButton).toBeDisabled(),
			expect(passwordResetFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const passwordResetToken = extractPasswordResetTokenFromMessage(filteredEmail);

		await page.goto(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`);

		const updatedUser = {
			...user,
			password: generatePassword()
		};

		await fillResetPasswordForm(page, {
			newPassword: updatedUser.password,
			confirmPassword: updatedUser.password
		});

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			resetPasswordResponsePromise(page),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);

		await Promise.all([
			loginUser(page, updatedUser),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Home.path}`)
		]);
	});

	test('Cannot login with the old password', async ({ page, user, passwordResetFormLocators }) => {
		await fillRequestResetPasswordTokenForm(page, user);

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			requestResetPasswordTokenResponsePromise(page),
			expect(passwordResetFormLocators.submitButton).toBeDisabled(),
			expect(passwordResetFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const passwordResetToken = extractPasswordResetTokenFromMessage(filteredEmail);

		await page.goto(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`);

		const updatedUser = {
			...user,
			password: generatePassword()
		};

		await fillResetPasswordForm(page, {
			newPassword: updatedUser.password,
			confirmPassword: updatedUser.password
		});

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			resetPasswordResponsePromise(page),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);

		const {
			submitButton,
			message
		} = getLoginFormLocators(page);

		await fillLoginForm(page, user);
		await submitButton.click();
		await expect(message).toHaveAttribute('data-error', 'true'),
		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);
	});

	test('Resetting password with a non-existing email returns an error', async ({ page, user, passwordResetFormLocators }) => {
		const userWithNonExistentEmail = {
			...user,
			email: generateEmailAddress()
		};

		await fillRequestResetPasswordTokenForm(page, userWithNonExistentEmail);

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			requestResetPasswordTokenResponsePromise(page, 400),
			expect(passwordResetFormLocators.submitButton).toBeDisabled(),
			expect(passwordResetFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});

	test('Resetting password with mismatching passwords disables the submit button', async ({ page, user, passwordResetFormLocators }) => {
		await fillRequestResetPasswordTokenForm(page, user);

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			requestResetPasswordTokenResponsePromise(page),
			expect(passwordResetFormLocators.submitButton).toBeDisabled(),
			expect(passwordResetFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const passwordResetToken = extractPasswordResetTokenFromMessage(filteredEmail);

		await page.goto(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`);

		const updatedUser = {
			...user,
			password: generatePassword()
		};

		await fillResetPasswordForm(page, {
			newPassword: updatedUser.password,
			confirmPassword: generatePassword()
		});

		await expect(passwordResetFormLocators.submitButton).toBeDisabled();
	});

	test('Resetting password with the same token twice returns an error', async ({ page, user, passwordResetFormLocators }) => {
		await fillRequestResetPasswordTokenForm(page, user);

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			requestResetPasswordTokenResponsePromise(page),
			expect(passwordResetFormLocators.submitButton).toBeDisabled(),
			expect(passwordResetFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const passwordResetToken = extractPasswordResetTokenFromMessage(filteredEmail);

		await page.goto(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`);

		const updatedUser = {
			...user,
			password: generatePassword()
		};

		await fillResetPasswordForm(page, {
			newPassword: updatedUser.password,
			confirmPassword: updatedUser.password
		});

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			resetPasswordResponsePromise(page),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);

		await page.goto(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`);

		await fillResetPasswordForm(page, {
			newPassword: updatedUser.password,
			confirmPassword: updatedUser.password
		});

		await Promise.all([
			passwordResetFormLocators.submitButton.click(),
			resetPasswordResponsePromise(page, 401),
			expect(page).toHaveURL(`${pages.ResetPassword.path}?password-reset-token=${passwordResetToken}`)
		]);
	});
});