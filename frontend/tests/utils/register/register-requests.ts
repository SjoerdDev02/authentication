import { Page } from "@playwright/test";

export const registerUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes('/register') &&
      response.request().method() === 'POST' &&
      response.status() === 201
	);