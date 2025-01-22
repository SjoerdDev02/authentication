import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { routes } from './constants/routes';

const refreshAccessToken = async (refreshTokenValue: string) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
			{},
			{
				withCredentials: true,
				headers: {
					Cookie: `RefreshToken=${refreshTokenValue}`,
				},
			}
		);
		return response.data.accessToken;
	} catch (error) {
		console.error('Token refresh failed:', error);
		return null;
	}
};

export async function middleware(req: NextRequest) {
	const bearerToken = req.cookies.get('Bearer');
	const refreshToken = req.cookies.get('RefreshToken');
	const url = req.nextUrl.clone();

	const currentRoute = routes.find((route) => url.pathname === route.path);

	if (currentRoute?.protected) {
		if (!bearerToken && !refreshToken) {
			return NextResponse.redirect(new URL('/login', req.url));
		} else if (!bearerToken && !!refreshToken) {
			const newBearerToken = await refreshAccessToken(refreshToken.value);

			if (newBearerToken) {
				const response = NextResponse.next();

				response.cookies.set('Bearer', newBearerToken, {
					httpOnly: true,
					secure: true,
					path: '/'
				});

				return response;
			} else {
				return NextResponse.redirect(new URL('/login', req.url));
			}
		}
	}

	if (!currentRoute?.protected) {
		if (bearerToken && refreshToken) {
			return NextResponse.redirect(new URL('/', req.url));
		} else if (!bearerToken && refreshToken) {
			const newBearerToken = await refreshAccessToken(refreshToken.value);

			if (newBearerToken) {
				const res = NextResponse.redirect(new URL('/', req.url));

				res.cookies.set('Bearer', newBearerToken, {
					httpOnly: true,
					secure: true,
					path: '/'
				});

				return res;
			}
		}
	}

	return NextResponse.next();
}