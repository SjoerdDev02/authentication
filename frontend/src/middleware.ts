import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Route, routeUrlToPageMap } from './constants/routes';

const refreshAccessToken = async (refreshTokenValue: string) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
			{},
			{
				withCredentials: true,
				headers: { // TODO: Check if headers can be removed
					Cookie: `RefreshToken=${refreshTokenValue}`,
				}
			}
		);

		return response.data.accessToken;
	} catch {
		return null;
	}
};

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
			const newBearerToken = await refreshAccessToken(refreshToken.value);

			if (newBearerToken) {
				console.log('New bearer token obtained');
				// You might want to set the new bearer token in the response here
				return NextResponse.next();
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
	matcher: ['/((?!_next|api|public|translations).*)']
};