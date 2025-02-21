import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Route, routeUrlToPageMap } from './constants/routes';
import { User } from './stores/userStore';
import { ApiResult } from './types/response';
import { gracefulFunction } from './utils/response';

export async function refreshAccessToken(refreshToken: string): Promise<ApiResult<User>> {
	return gracefulFunction(async () => {
	  const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cookie': `RefreshToken=${refreshToken}` // TODO: Check if you can remove this as you include credentials already
				},
				credentials: 'include',
			}
		);

	  if (!response.ok) {
			throw new Error('Failed to refresh token');
	  }

	  const data = await response.json();

	  return {
			message: data.message,
			data: data.data
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
		} else if (!bearerToken?.value && !!refreshToken?.value) {
			// TODO: Check why you see the set-cookie headers but they are not set
			const refreshResponse = await refreshAccessToken(refreshToken.value);

			if (!refreshResponse.success) {
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
	matcher: ['/((?!_next|api|public|translations).*)']
};