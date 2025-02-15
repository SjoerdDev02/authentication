import { Page } from "@playwright/test";

export const loginUserResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes('/login') &&
      response.request().method() === 'POST' &&
      response.status() === statusCode
	);