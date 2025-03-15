import { Page } from "@playwright/test";

export const requestResetPasswordTokenResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes('/password_reset') &&
      response.request().method() === 'POST' &&
      response.status() === statusCode
	);

export const resetPasswordResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes('/password_reset') &&
		  response.request().method() === 'PATCH' &&
		  response.status() === statusCode
	);