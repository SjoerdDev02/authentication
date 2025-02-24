import { Page } from "@playwright/test";

export const updateUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes('/update') &&
      response.request().method() === 'PATCH' &&
      response.status() === 200
	);