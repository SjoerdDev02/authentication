import { Page } from "@playwright/test";

export function getNotFoundPageLocators(page: Page) {
	const pageWrapper = page.getByTestId('not-found-page');
	const notFoundLink = pageWrapper.getByTestId('not-found-page-link');

	return {
		pageWrapper,
		notFoundLink
	};
}