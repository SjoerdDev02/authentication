import { test as base } from '@playwright/test';

export const test = base.extend({
	page: async ({ page, context }, use) => {
		const cookies = [
			{
				name: 'language',
				value: 'EN',
				domain: 'localhost',
				path: '/',
				secure: false,
				httpOnly: false,
			},
			{
				name: 'theme',
				value: 'dark',
				domain: 'localhost',
				path: '/',
				secure: false,
				httpOnly: false,
			},
		];

		await context.addCookies(cookies);

		await use(page);
	},
});
