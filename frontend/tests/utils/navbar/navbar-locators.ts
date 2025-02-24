import { Page } from "@playwright/test";

export function getNavbarLocators(page: Page) {
	const navbar = page.getByTestId('navbar');
	const logo = navbar.getByTestId('navbar-logo');
	const userMenu = navbar.getByTestId('link-dropdown');

	return {
		navbar,
		logo,
		userMenu
	};
}