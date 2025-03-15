import { LoginUser } from '@/components/authentication/login/LoginForm';
import { User } from '@/stores/userStore';
import { AuthData, Tokens } from '@/types/authentication';
import { ApiResult } from '@/types/response';
import { API_ROUTES, apiClient } from '@/utils/api';
import { extractSetCookieTokens } from '@/utils/preferences/cookies';
import { gracefulFunction } from '@/utils/response';
import { sanitize } from '@/utils/strings';

export class AuthService {
	   logoutUser(): Promise<ApiResult<AuthData>> {
		return gracefulFunction(async () => {
			const response = await apiClient.post(API_ROUTES.auth.logout);

		  return {
				message: response.data.message,
				data: response.data.data,
		  };
		});
	}

	 loginUser(user: LoginUser): Promise<ApiResult<AuthData>> {
		return gracefulFunction(async () => {
			if (!user.email || !user.password) {
				return {
					success: false,
					message: 'Invalid credentials',
					data: null
				};
			}

			const email = sanitize(user.email);
			const password = sanitize(user.password);

			const response = await apiClient.post(API_ROUTES.auth.login, {
				email,
				password
			});

			return {
				success: true,
				message: response.data.message,
				data: response.data.data
			};
		});
	}

	refreshAccessToken(refreshToken: string): Promise<ApiResult<User & Tokens>> {
		return gracefulFunction(async () => {
			const response = await fetch(
				API_ROUTES.auth.refresh,
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
}
