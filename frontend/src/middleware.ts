import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS } from './constants/auth';
import { Route, routeUrlToPageMap } from './constants/routes';
import { User } from './stores/userStore';
import { Tokens } from './types/authentication';
import { ApiResult } from './types/response';
import { extractSetCookieTokens } from './utils/preferences/cookies';
import { gracefulFunction } from './utils/response';

export async function refreshAccessToken(refreshToken: string): Promise<ApiResult<User & Tokens>> {
	return gracefulFunction(async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
			{
				method: 'POST',
				headers: {
					'Cookie': `RefreshToken=${refreshToken}` // Needs to be explicitly set as NextJS middleware does not send the RefreshToken automatically when including credentials
				},
				credentials: 'include',
			}
		);

		const tokens = extractSetCookieTokens(response.headers.getSetCookie());

		if (!response.ok) {
			throw new Error('Failed to refresh token');
		}

		const data = await response.json();

		return {
			message: data.message,
			data: {
				...data.data,
				...tokens
			}
		};
	});
}

export async function middleware(req: NextRequest) {
	const bearerToken = req.cookies.get('Bearer');
	const refreshToken = req.cookies.get('RefreshToken');
	const { pathname } = req.nextUrl.clone();

	const currentRoute = pathname in routeUrlToPageMap
	  ? routeUrlToPageMap[pathname as Route]
	  : null;

	if (currentRoute?.protected) {
		if (!bearerToken?.value && !refreshToken?.value) {
			return NextResponse.redirect(new URL('/login', req.url));
		} else if (!bearerToken?.value && refreshToken?.value) {
			const refreshResponse = await refreshAccessToken(refreshToken.value);

			// The Bearer and RefreshToken are normally set by the server, but Next.js middleware
			// doesn't automatically apply Set-Cookie headers from the server response.
			// Therefore, we manually set these cookies here to ensure they're properly stored.
			if (refreshResponse.success && refreshResponse.data?.bearer && refreshResponse.data.refreshToken) {
				const response = NextResponse.next();

				response.cookies.set('Bearer', refreshResponse.data.bearer, {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					maxAge: BEARER_EXPIRATION_SECONDS
				});

				response.cookies.set('RefreshToken', refreshResponse.data.refreshToken, {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					maxAge: REFRESH_EXPIRATION_SECONDS
				});

				return response;
			} else {
				return NextResponse.redirect(new URL('/login', req.url));
			}
		}
	}

	return NextResponse.next();
}

// This matcher applies middleware to all routes **except**:
// - Static assets (_next) served by Next.js
// - API routes (api)
// - Publicly accessible assets (like images, public folder files)
// It uses a negative lookahead regex pattern `(?!...)` to exclude these paths.
export const config = {
	matcher: ['/((?!_next|api|public|translations|favicon\\.ico).*)']
};