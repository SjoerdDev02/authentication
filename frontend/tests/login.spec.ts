import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from './test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { createUser } from './utils/auth';
import { fillLoginForm } from './utils/login/login-actions';
import { getLoginFormLocators } from './utils/login/login-locators';
import { loginUserResponsePromise } from './utils/login/login-requests';

const test = base.extend<
{
    user: Awaited<ReturnType<typeof createUser>>,
	loginFormLocators: ReturnType<typeof getLoginFormLocators>
}>({
	user: async ({ page }, use) => {
		const user = await createUser(page);

		await use(user);
	},
  	loginFormLocators: async ({ page }, use) => {
	  const locators = getLoginFormLocators(page);
	  await use(locators);
  	},
});

test.beforeEach(async ({ page }) => {
	await page.goto(pages.Login.path);

	await page.waitForURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);
});

test.describe('login', () => {
	// TODO: Fix this test
	test('Login using valid email and password', async ({ page, user, loginFormLocators }) => {
		await fillLoginForm(page, user);

		await Promise.all([
			loginFormLocators.submitButton.click(),
			loginUserResponsePromise(page),
			expect(loginFormLocators.submitButton).toBeDisabled(),
			expect(loginFormLocators.message).toHaveAttribute('data-error', 'false'),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Home.path}`)
		]);
	});

	test('Login using invalid password returns an error', async ({ page, user, loginFormLocators }) => {
		await fillLoginForm(page, {
			email: user.email,
			password: 'invalid-password'
		});

		await Promise.all([
			loginFormLocators.submitButton.click(),
			loginUserResponsePromise(page, 401),
			expect(loginFormLocators.submitButton).toBeDisabled(),
			expect(loginFormLocators.message).toHaveAttribute('data-error', 'true'),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);
	});

	test('Cannot visit protected paths before logging in', async ({ page }) => {
		await Promise.all([
			page.goto(pages.Home.path),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);

		await Promise.all([
			page.goto(pages.Update.path),
			expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`)
		]);
	});
});