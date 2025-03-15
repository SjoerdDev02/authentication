import { Page } from "@playwright/test";

import { API_ROUTES } from "@/utils/api";

export const loginUserResponsePromise = (page: Page, statusCode = 200) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.auth.login)
		&& response.request().method() === 'POST'
		&& response.status() === statusCode
	);