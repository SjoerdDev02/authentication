import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS } from '@/constants/auth';
import { Route, routeUrlToPageMap } from '@/constants/routes';
import { NoDataApiResult } from '@/types/response';
import { API_ROUTES, apiClient } from '@/utils/api';
import { extractSetCookieTokens } from '@/utils/preferences/cookies';

// TODO: Use the function in the authService this instead when Zod Mini had fixed dynamic code evaluation in Edge Runtime environments
async function refreshAccessToken(refreshToken: string) {
	try {
		const response = await apiClient.post(API_ROUTES.auth.refresh, {
			headers: {
				'Cookie': `RefreshToken=${refreshToken}` // Needs to be explicitly set as NextJS middleware does not send the RefreshToken automatically when including credentials
			}
		});

		const tokens = extractSetCookieTokens(response.headers.getSetCookie());

		const data = await response.json<NoDataApiResult>();

		return {
			success: true,
			message: data.message,
			data: tokens
		};
	} catch {
		return {
			success: false,
			message: 'Something went wrong',
			data: null
		};
	}
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