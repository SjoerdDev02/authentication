import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from '@/e2e/test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';
import { createUser } from '@/e2e/utils/auth';
import { clickItemFromLinkDropdown } from '@/e2e/utils/dropdowns/link-dropdown-actions';
import { fillLoginForm } from '@/e2e/utils/login/login-actions';
import { getLoginFormLocators } from '@/e2e/utils/login/login-locators';
import { loginUserResponsePromise } from '@/e2e/utils/login/login-requests';
import { logoutUserResponsePromise } from '@/e2e/utils/logout/logout-requests';
import { getNavbarLocators } from '@/e2e/utils/navbar/navbar-locators';

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