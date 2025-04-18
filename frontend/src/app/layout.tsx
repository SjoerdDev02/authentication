import "@/styles/globals.scss";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import { UserService } from "@/app/services/user-service";
import Navigation from "@/components/navigation/Navigation";
import { TranslationsProvider } from "@/stores/translationsStore";
import { UserStoreProvider } from "@/stores/userStore";
import { getPreferredLanguage, getPreferredTheme, getTranslations } from "@/utils/preferences/preferences";

const inter = localFont({
	src: "./fonts/InterVariable.woff2",
	variable: '--font-inter',
	weight: "100 900"
});

export const metadata: Metadata = {
	title: "Todo List",
	description: "Manage your tasks like never before",
};

export default async function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const initialTheme = await getPreferredTheme();
	const initialLanguage = await getPreferredLanguage();
	const initialTranslations = await getTranslations(initialLanguage);

	const cookieStore = await cookies();

	const bearerToken = cookieStore.get('Bearer');
	const refreshToken = cookieStore.get('RefreshToken');

	const userService = new UserService();

	const initialUser = !!bearerToken?.value && !!refreshToken?.value
		? (await userService.getUser(bearerToken?.value, refreshToken?.value)).data
		: null;

	return (
		<html
			data-language={initialLanguage}
			data-theme={initialTheme}
			lang="en"
		>
			<body className={inter.variable}>
				<TranslationsProvider initialTranslations={initialTranslations}>
					<UserStoreProvider initialUser={initialUser}>
						<Navigation
							initialLanguage={initialLanguage}
							initialTheme={initialTheme}
						/>

						<main>{children}</main>

						<div id="modal" />
					</UserStoreProvider>
				</TranslationsProvider>
			</body>
		</html>
	);
}
