import { Page } from "@playwright/test";

export const logoutUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes('/logout') &&
      response.request().method() === 'POST' &&
      response.status() === 200
	);