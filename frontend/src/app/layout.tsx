import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import Navigation from "@/components/navigation/Navigation";
import { getPreferredLanguage, getPrefferedTheme } from "@/utils/preferences/preferences";

const inter = localFont({
	src: "./fonts/InterVariable.woff2",
	variable: '--font-inter',
	weight: "100 900"
});

export const metadata: Metadata = {
	title: "Todo List",
	description: "Manage your tasks like never before",
};

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const initialTheme = getPrefferedTheme();
	const initialLanguage = getPreferredLanguage();

	return (
		<html
			data-language={initialLanguage}
			data-theme={initialTheme}
			lang="en"
		>
			<body className={`${inter.variable}`}>
				<Navigation />

				<main>{children}</main>
			</body>
		</html>
	);
}
