import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { pages } from '@/constants/routes';
import { test as base } from '@/e2e/test';
import { createUser } from '@/e2e/utils/auth';
import { loginUser } from '@/e2e/utils/login/login-actions';
import { goBackHome } from '@/e2e/utils/not-found/not-found-actions';
import { getNotFoundPageLocators } from '@/e2e/utils/not-found/not-found-locators';

dotenv.config({
	silent: true
});

const nonExistingPageUrl = '/non-existing-page';

const test = base.extend<
{
    notFoundPageLocators: ReturnType<typeof getNotFoundPageLocators>
}>({
	notFoundPageLocators: async ({ page }, use) => {
		const locators = getNotFoundPageLocators(page);
		await use(locators);
	},
});

test.describe('Not found page', () => {
	test('Entering a non-existing page url brings the user to the not found page', async ({ page, notFoundPageLocators }) => {
		await page.goto(nonExistingPageUrl);

		await expect(notFoundPageLocators.pageWrapper).toBeVisible();
		await expect(page).toHaveURL(nonExistingPageUrl);
	});

	test('Clicking the link as unauthenticated user brings the user to the login page', async ({ page, notFoundPageLocators }) => {
		await page.goto(nonExistingPageUrl);

		await goBackHome(notFoundPageLocators.notFoundLink);
		await expect(page).toHaveURL(pages.Login.path);
	});

	test('Clicking the link as authenticated user brings the user to the home page', async ({ page, notFoundPageLocators }) => {
		const user = await createUser(page);
		await loginUser(page, user);

		await page.goto(nonExistingPageUrl);

		await goBackHome(notFoundPageLocators.notFoundLink);
		await expect(page).toHaveURL(pages.Home.path);
	});
});