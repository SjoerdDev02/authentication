import { expect } from '@playwright/test';
import dotenv from 'dotenv-flow';

import { test as base } from './test';

dotenv.config({
	silent: true
});

import { pages } from '@/constants/routes';

import { createUser } from './utils/auth';
import { clickItemFromLinkDropdown } from './utils/dropdowns/link-dropdown-actions';
import { extractOtcFromMessage, getAllEmails, getMessageByRecipient } from './utils/email';
import { loginUser } from './utils/login/login-actions';
import { getNavbarLocators } from './utils/navbar/navbar-locators';
import { getOTCFormLocators } from './utils/otc/otc-locators';
import { fillUpdateFormUserDetails } from './utils/update/update-actions';
import { getUpdateFormLocators } from './utils/update/update-locators';
import { updateUserResponsePromise } from './utils/update/update-requests';

const test = base.extend<
{
    user: Awaited<ReturnType<typeof createUser>>,
	navbarLocators: ReturnType<typeof getNavbarLocators>,
	updateFormLocators: ReturnType<typeof getUpdateFormLocators>,
	otcFormLocators: ReturnType<typeof getOTCFormLocators>
}>({
	user: async ({ page }, use) => {
		const user = await createUser(page);

		await use(user);
	},
	navbarLocators: async ({ page }, use) => {
		const locators = getNavbarLocators(page);

		await use(locators);
	},
  	updateFormLocators: async ({ page }, use) => {
	  const locators = getUpdateFormLocators(page);

	  await use(locators);
  	},
	otcFormLocators: async ({ page }, use) => {
		const locators = getOTCFormLocators(page);

		await use(locators);
	}
});

test.beforeEach(async ({ page, user, navbarLocators }) => {
	await loginUser(page, user);

	await clickItemFromLinkDropdown(navbarLocators.userMenu, 'settings-option');
});

// Update user details with valid data
// Updating user details with invalid phone disables the submit button
// Updating user details with invalid email disables the submit button

// Update password with valid password
// Updating with an invalid password disables te submit button
// Updating with mismatching passwords disables the submit button

// Cannot login after deleting your account

test.describe('update user details', () => {
	test('Update user details with valid data', async ({ page, user, updateFormLocators, otcFormLocators, navbarLocators }) => {
		const { name } = await fillUpdateFormUserDetails(page);

		await Promise.all([
			updateFormLocators.submitButton.click(),
			updateUserResponsePromise(page),
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(updateFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const otc = extractOtcFromMessage(filteredEmail);

		await page.goto(`${pages.Otc.path}?otc=${otc}`);

		await otcFormLocators.submitButton.click();

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Home.path}`);
		await expect(navbarLocators.userMenu).toContainText(name);
	});
});