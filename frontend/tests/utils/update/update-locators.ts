import { Page } from "@playwright/test";

export function getUpdateFormLocators(page: Page) {
	const updateForm = page.getByTestId('form');
	const nameInput = updateForm.getByTestId('update-name-input');
	const phoneInput = updateForm.getByTestId('update-phone-input');
	const emailInput = updateForm.getByTestId('update-email-input');
	const emailConfirmInput = updateForm.getByTestId('update-email-confirm-input');
	const passwordInput = updateForm.getByTestId('update-password-input');
	const passwordConfirmInput = updateForm.getByTestId('update-password-confirm-input');
	const message = updateForm.getByTestId('update-message');
	const submitButton = updateForm.getByTestId('submit-button');

	return {
		nameInput,
		phoneInput,
		emailInput,
		emailConfirmInput,
		passwordInput,
		passwordConfirmInput,
		message,
		submitButton
	};
}