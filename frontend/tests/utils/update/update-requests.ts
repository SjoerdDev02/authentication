import { Page } from "@playwright/test";

import { API_ROUTES } from "@/utils/api";

export const updateUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.user.update)
		&& response.request().method() === 'PATCH'
		&& response.status() === 200
	);

export const deleteUserResponsePromise = (page: Page) =>
	page.waitForResponse(response =>
		response.url().includes(API_ROUTES.user.delete)
		&& response.request().method() === 'DELETE'
		&& response.status() === 200
	);