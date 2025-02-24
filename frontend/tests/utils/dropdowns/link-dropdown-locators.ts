import { Locator } from "@playwright/test";

export function getLinkDropdownLocators(linkDropdown: Locator) {
	const toggle = linkDropdown.getByTestId('link-dropdown-toggle');
	const menu = linkDropdown.getByTestId("link-dropdown-menu");

	return {
		toggle,
		menu
	};
}