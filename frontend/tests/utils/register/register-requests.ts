import { Page } from "@playwright/test";

import { API_ROUTES } from "@/utils/api";

export const registerUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.user.register)
		&& response.request().method() === 'POST'
	  	&& response.status() === 201
	);