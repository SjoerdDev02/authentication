import { Page } from "@playwright/test";

export function getOTCFormLocators(page: Page) {
	const otcForm = page.getByTestId('form');
	const submitButton = otcForm.getByTestId('submit-button');

	return {
		submitButton
	};
}