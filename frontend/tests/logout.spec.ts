import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from './test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { createUser } from './utils/auth';
import { clickItemFromLinkDropdown } from './utils/dropdowns/link-dropdown-actions';
import { fillLoginForm } from './utils/login/login-actions';
import { getLoginFormLocators } from './utils/login/login-locators';
import { loginUserResponsePromise } from './utils/login/login-requests';
import { logoutUserResponsePromise } from './utils/logout/logout-requests';
import { getNavbarLocators } from './utils/navbar/navbar-locators';

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

test.describe('logout', () => {
	test('Logout as logged in user', async ({ page, user, loginFormLocators }) => {
		await fillLoginForm(page, user);

		const { userMenu } = getNavbarLocators(page);

		await Promise.all([
			loginFormLocators.submitButton.click(),
			loginUserResponsePromise(page),
		]);

		await Promise.all([
			clickItemFromLinkDropdown(userMenu, 'logout-option'),
			logoutUserResponsePromise(page)
		]);

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);
		await expect(userMenu).toBeHidden();
	});
});