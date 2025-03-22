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
import { getAuthFormInputLocators } from './utils/forms/auth-form-input-locators';
import { fillLoginForm, loginUser } from './utils/login/login-actions';
import { getLoginFormLocators } from './utils/login/login-locators';
import { getNavbarLocators } from './utils/navbar/navbar-locators';
import { getOTCFormLocators } from './utils/otc/otc-locators';
import { fillUpdateFormPassword, fillUpdateFormUserDetails } from './utils/update/update-actions';
import { getUpdateFormLocators } from './utils/update/update-locators';
import { deleteUserResponsePromise, updateUserResponsePromise } from './utils/update/update-requests';

const test = base.extend<
{
    user: Awaited<ReturnType<typeof createUser>>,
	loginFormLocators: ReturnType<typeof getLoginFormLocators>,
	navbarLocators: ReturnType<typeof getNavbarLocators>,
	updateFormLocators: ReturnType<typeof getUpdateFormLocators>,
	otcFormLocators: ReturnType<typeof getOTCFormLocators>
}>({
	user: async ({ page }, use) => {
		const user = await createUser(page);

		await use(user);
	},
	loginFormLocators: async ({ page }, use) => {
		const locators = getLoginFormLocators(page);

		await use(locators);
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

test.describe('update user details', () => {
	test('Update user details with valid data', async ({ page, user, updateFormLocators, otcFormLocators, navbarLocators }) => {
		const { name } = await fillUpdateFormUserDetails(page);

		await Promise.all([
			updateFormLocators.submitButton.click(),
			updateUserResponsePromise(page),
		]);

		await Promise.all([
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

	test('Updating user details with invalid phone disables the submit button', async ({ page, updateFormLocators }) => {
		const invalidPhoneNumber = 'invalidPhoneNumber';

		await fillUpdateFormUserDetails(page, {
			preDefinedFields: {
				phone: invalidPhoneNumber
			}
		});

		const { errorMessage } = getAuthFormInputLocators(updateFormLocators.phoneInputWrapper);

		await Promise.all([
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(errorMessage).toBeVisible()
		]);
	});

	test('Updating user details with invalid email disables the submit button', async ({ page, updateFormLocators }) => {
		const invalidEmail = 'invalidEmail';

		await fillUpdateFormUserDetails(page, {
			preDefinedFields: {
				email: invalidEmail
			}
		});

		const { errorMessage } = getAuthFormInputLocators(updateFormLocators.emailInputsWrapper);

		await Promise.all([
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(errorMessage).toBeVisible()
		]);
	});
});

test.describe('update user password', () => {
	test('Update password with valid data', async ({ page, user, updateFormLocators, otcFormLocators }) => {
		await fillUpdateFormPassword(page);

		await Promise.all([
			updateFormLocators.submitButton.click(),
			updateUserResponsePromise(page),
		]);

		await Promise.all([
		 expect(updateFormLocators.submitButton).toBeDisabled(),
		 expect(updateFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const otc = extractOtcFromMessage(filteredEmail);

		await page.goto(`${pages.Otc.path}?otc=${otc}`);

		await otcFormLocators.submitButton.click();

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Home.path}`);
	});

	test('Updating with an invalid password disables te submit button', async ({ page, updateFormLocators }) => {
		const invalidPasswordNumber = 'invalidPassword';

		await fillUpdateFormPassword(page, {
			preDefinedFields: {
				password: invalidPasswordNumber
			}
		});

		const { errorMessage } = getAuthFormInputLocators(updateFormLocators.passwordInputsWrapper);

		await Promise.all([
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(errorMessage).toBeVisible()
		]);
	});

	test('Updating with mismatching passwords disables the submit button', async ({ page, updateFormLocators }) => {
		const password = 'MyPassword12!';
		const passwordConfirm = 'MyPassword!12';

		await fillUpdateFormPassword(page, {
			preDefinedFields: {
				password,
				passwordConfirm
			}
		});

		const { errorMessage } = getAuthFormInputLocators(updateFormLocators.passwordInputsWrapper);

		await Promise.all([
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(errorMessage).toBeVisible()
		]);
	});
});

test.describe('delete user', () => {
	test('Cannot login after deleting your account', async ({ page, user, updateFormLocators, otcFormLocators, loginFormLocators }) => {
		await Promise.all([
			updateFormLocators.deleteButton.click(),
			deleteUserResponsePromise(page),
		]);

		await Promise.all([
			expect(updateFormLocators.submitButton).toBeDisabled(),
			expect(updateFormLocators.message).toHaveAttribute('data-error', 'false')
		]);

		const allEmails = await getAllEmails();
		const filteredEmail = getMessageByRecipient(allEmails, user.email);
		const otc = extractOtcFromMessage(filteredEmail);

		await page.goto(`${pages.Otc.path}?otc=${otc}`);

		await otcFormLocators.submitButton.click();

		await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Login.path}`);

		await Promise.all([
			fillLoginForm(page, user),
			loginFormLocators.submitButton.click(),
			expect(loginFormLocators.message).toHaveAttribute('data-error', 'true')
		]);
	});
});