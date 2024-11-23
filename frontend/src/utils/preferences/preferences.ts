import { cookies, headers } from 'next/headers';

export type ThemeType = 'light' | 'dark';
export type LanguageType = 'NL' | 'EN' | 'FR' | 'GE' | 'ES';

export async function getPreferredTheme(): Promise<ThemeType> {
	let prefersDarkMode: ThemeType = 'light';

	const cookieStore = await cookies();

	if (cookieStore.has('theme')) {
		const cookiesTheme = cookieStore.get('theme');
		prefersDarkMode = cookiesTheme?.value === 'dark' ? 'dark' : 'light';
	} else {
		const headersStore = await headers();
		const userAgentTheme = !!headersStore.get('user-agent')?.includes('DarkMode');
		prefersDarkMode = userAgentTheme ? 'dark' : 'light';
	}

	return prefersDarkMode;
}

export async function getPreferredLanguage(): Promise<LanguageType> {
	let preferredLanguage: LanguageType = 'EN';

	const cookieStore = await cookies();

	if (cookieStore.has('language')) {
		const cookiesLanguage = cookieStore.get('language');
		preferredLanguage = cookiesLanguage?.value as LanguageType;
	} else {
		const headersStore = await headers();
		const acceptLanguageHeader = headersStore.get('accept-language');

		if (acceptLanguageHeader) {
			if (acceptLanguageHeader.toLowerCase().includes('nl')) {
				preferredLanguage = 'NL';
			} else if (acceptLanguageHeader.toLowerCase().includes('fr')) {
				preferredLanguage = 'FR';
			} else if (acceptLanguageHeader.toLowerCase().includes('ge')) {
				preferredLanguage = 'GE';
			} else if (acceptLanguageHeader.toLowerCase().includes('es')) {
				preferredLanguage = 'ES';
			}
		}
	}

	return preferredLanguage;
}
