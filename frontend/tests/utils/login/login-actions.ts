import { Page } from "@playwright/test";

import { LoginUser } from "@/components/authentication/login/LoginForm";
import { pages } from "@/constants/routes";

import { getLoginFormLocators } from "./login-locators";
import { loginUserResponsePromise } from "./login-requests";

export async function fillLoginForm(page: Page, user: LoginUser) {
	const {
		emailInput,
		passwordInput,
	} = getLoginFormLocators(page);

	await emailInput.fill(user.email);
	await passwordInput.fill(user.password);
}

// This function is for not-login but for other tests to quickly login
export async function loginUser(page: Page, user: LoginUser) {
	const { submitButton } = getLoginFormLocators(page);

	await Promise.all([
		fillLoginForm(page, user),
		submitButton.click(),
		loginUserResponsePromise(page),
		page.waitForURL(`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${pages.Home.path}`, {
			waitUntil: 'load'
		})
	]);
}