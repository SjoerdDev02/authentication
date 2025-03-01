import { Locator } from "@playwright/test";

export function getAuthFormInputLocators(authFormInput: Locator) {
	const errorMessage = authFormInput.getByTestId('auth-form-input-error-message');

	return {
		errorMessage
	};
}