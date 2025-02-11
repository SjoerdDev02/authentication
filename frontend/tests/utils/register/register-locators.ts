import { Page } from "@playwright/test";

export function getRegisterFormLocators(page: Page) {
	const registerForm = page.getByTestId('form');
	const nameInput = registerForm.getByTestId('register-name-input');
	const emailInput = registerForm.getByTestId('register-email-input');
	const passwordInput = registerForm.getByTestId('register-password-input');
	const passwordConfirmInput = registerForm.getByTestId('register-password-confirm-input');
	const message = registerForm.getByTestId('register-message');
	const submitButton = registerForm.getByTestId('submit-button');

	return {
		nameInput,
		emailInput,
		passwordInput,
		passwordConfirmInput,
		message,
		submitButton
	};
}