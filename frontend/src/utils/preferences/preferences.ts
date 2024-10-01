import { cookies, headers } from 'next/headers';

// Both functions are meant for SSR
export type ThemeType = 'light' | 'dark';
export type LanguageType = 'NL' | 'EN' | 'FR' | 'GE' | 'ES';

export function getPrefferedTheme(): ThemeType {
	let prefersDarkMode: ThemeType = 'light';

	if (cookies().has('theme')) {
		const cookiesTheme = cookies().get('theme');
		prefersDarkMode = cookiesTheme?.value === 'dark' ? 'dark' : 'light';
	} else {
		const userAgentTheme = !!headers().get('user-agent')?.includes('DarkMode');
		prefersDarkMode = userAgentTheme ? 'dark' : 'light';
	}

	return prefersDarkMode;
}

export function getPreferredLanguage(): LanguageType {
	let preferredLanguage: LanguageType = 'EN';

	if (cookies().has('language')) {
		const cookiesLanguage = cookies().get('language');
		preferredLanguage = cookiesLanguage?.value as LanguageType;
	} else {
		const acceptLanguageHeader = headers().get('accept-language');

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
