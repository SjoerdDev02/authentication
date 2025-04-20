import { Locator } from "@playwright/test";

export const goBackHome = async (notFoundLink: Locator) => {
	await notFoundLink.click();
};