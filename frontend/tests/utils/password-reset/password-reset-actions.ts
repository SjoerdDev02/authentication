import { Page } from "@playwright/test";

import { getPasswordResetFormLocators } from "@/e2e/utils/password-reset/password-reset-locators";
import { PasswordResetUser } from "@/utils/hooks/useResetUserPassword";

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