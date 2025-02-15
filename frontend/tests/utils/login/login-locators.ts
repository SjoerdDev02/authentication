import { Page } from "@playwright/test";

export function getLoginFormLocators(page: Page) {
	const loginForm = page.getByTestId('form');
	const emailInput = loginForm.getByTestId('login-email-input');
	const passwordInput = loginForm.getByTestId('login-password-input');
	const message = loginForm.getByTestId('login-message');
	const submitButton = loginForm.getByTestId('submit-button');

	return {
		emailInput,
		passwordInput,
		message,
		submitButton
	};
}