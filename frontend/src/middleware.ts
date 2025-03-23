import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AuthService } from './app/services/auth-service';
import { UserService } from './app/services/user-service';
import { BEARER_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS } from './constants/auth';
import { Route, routeUrlToPageMap } from './constants/routes';
import userStore from './stores/userStore';

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
			const authService = new AuthService();
			const refreshResponse = await authService.refreshAccessToken(refreshToken.value);

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

		// TODO: Make user/me call work. This does not work currently because Valtio has no support for NextJS edge runtime middleware
		if (!userStore.user) {
			const userService = new UserService();
			const result = await userService.getUser();

			userStore.user = result.data;
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