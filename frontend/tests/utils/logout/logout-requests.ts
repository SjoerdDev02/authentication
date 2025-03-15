import { Page } from "@playwright/test";

import { API_ROUTES } from "@/utils/api";

export const logoutUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.auth.logout)
		&& response.request().method() === 'POST'
		&& response.status() === 200
	);