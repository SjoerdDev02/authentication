import { Page } from "@playwright/test";

import { PasswordResetUser } from "@/utils/hooks/useResetUserPassword";

import { getPasswordResetFormLocators } from "./password-reset-locators";

export async function fillRequestResetPasswordTokenForm(page: Page, user: Omit<PasswordResetUser, 'newPassword' | 'confirmPassword'>) {
	const {
		emailInput,
	} = getPasswordResetFormLocators(page);

	await emailInput.fill(user.email);
}

export async function fillResetPasswordForm(page: Page, user: Omit<PasswordResetUser, 'email'>) {
	const {
		newPasswordInput,
		confirmPasswordInput,
	} = getPasswordResetFormLocators(page);

	await newPasswordInput.fill(user.newPassword);
	await confirmPasswordInput.fill(user.confirmPassword);
}