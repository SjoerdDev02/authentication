import { Tokens } from "@/types/authentication";

export function setCookie(name: string, value: string, days: number) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

export function getClientCookie(cookieName: string): string | undefined {
	if (typeof window === 'undefined') return undefined;

	const cookieNameWithEquals = `${cookieName}=`;
	const allCookies = document.cookie.split(';');

	for (let i = 0; i < allCookies.length; i++) {
	  let currentCookie = allCookies[i].trim();

	  if (currentCookie.indexOf(cookieNameWithEquals) === 0) {
			return decodeURIComponent(currentCookie.substring(cookieNameWithEquals.length));
	  }
	}

	return undefined;
}


export function eraseCookie(name: string) {
	document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function extractSetCookieTokens(setCookieArray: string[]): Tokens {
	const tokens: Tokens = { bearer: null, refreshToken: null };

	setCookieArray.forEach(cookie => {
	  if (cookie.startsWith('Bearer=')) {
			tokens.bearer = cookie.split(';')[0].split('=')[1];
	  } else if (cookie.startsWith('RefreshToken=')) {
			tokens.refreshToken = cookie.split(';')[0].split('=')[1];
	  }
	});

	return tokens;
}
