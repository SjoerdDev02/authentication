import { Page } from "@playwright/test";

import { API_ROUTES } from "@/utils/api";

export const requestResetPasswordTokenResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.user.resetPasswordRequest)
		&& response.request().method() === 'POST'
	  	&& response.status() === statusCode
	);

export const resetPasswordResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.user.resetPassword)
		&& response.request().method() === 'PATCH'
		&& response.status() === statusCode
	);