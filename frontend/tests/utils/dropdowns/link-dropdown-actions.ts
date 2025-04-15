import { Locator } from "@playwright/test";

import { getLinkDropdownLocators } from "@/e2e/utils/dropdowns/link-dropdown-locators";

export async function clickItemFromLinkDropdown(linkDropdown: Locator, selectItem: string) {
	const {
		toggle,
		menu
	} = getLinkDropdownLocators(linkDropdown);

	await toggle.click();

	const selectDropdownItem = menu.getByTestId(selectItem);

	selectDropdownItem.click();
}