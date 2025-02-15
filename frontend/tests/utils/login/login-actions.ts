import { Page } from "@playwright/test";

import { LoginUser } from "@/components/authentication/login/LoginForm";

import { getLoginFormLocators } from "./login-locators";

export async function fillLoginForm(page: Page, user: LoginUser) {
	const {
		emailInput,
		passwordInput,
	} = getLoginFormLocators(page);

	await emailInput.fill(user.email);
	await passwordInput.fill(user.password);
}