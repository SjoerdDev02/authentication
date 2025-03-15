import { Page } from "@playwright/test";

export function getPasswordResetFormLocators(page: Page) {
	const passwordResetForm = page.getByTestId('form');
	const emailInput = passwordResetForm.getByTestId('password-reset-email-input');
	const newPasswordInput = passwordResetForm.getByTestId('new-password-reset-input');
	const confirmPasswordInput = passwordResetForm.getByTestId('confirm-password-reset-input');
	const message = passwordResetForm.getByTestId('password-reset-message');
	const submitButton = passwordResetForm.getByTestId('submit-button');

	return {
		emailInput,
		newPasswordInput,
		confirmPasswordInput,
		message,
		submitButton
	};
}