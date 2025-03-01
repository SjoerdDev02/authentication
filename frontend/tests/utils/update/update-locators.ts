import { Page } from "@playwright/test";

export function getUpdateFormLocators(page: Page) {
	const updateForm = page.getByTestId('form');
	const nameInput = updateForm.getByTestId('update-name-input');
	const phoneInput = updateForm.getByTestId('update-phone-input');
	const phoneInputWrapper = updateForm.getByTestId('update-phone-input-wrapper');
	const emailInput = updateForm.getByTestId('update-email-input');
	const emailConfirmInput = updateForm.getByTestId('update-email-confirm-input');
	const emailInputsWrapper = updateForm.getByTestId('update-email-inputs-wrapper');
	const passwordInput = updateForm.getByTestId('update-password-input');
	const passwordConfirmInput = updateForm.getByTestId('update-password-confirm-input');
	const passwordInputsWrapper = updateForm.getByTestId('update-password-inputs-wrapper');
	const message = updateForm.getByTestId('update-message');
	const submitButton = updateForm.getByTestId('submit-button');
	const deleteButton = updateForm.getByTestId('delete-button');

	return {
		nameInput,
		phoneInput,
		phoneInputWrapper,
		emailInput,
		emailConfirmInput,
		emailInputsWrapper,
		passwordInput,
		passwordConfirmInput,
		passwordInputsWrapper,
		message,
		submitButton,
		deleteButton
	};
}