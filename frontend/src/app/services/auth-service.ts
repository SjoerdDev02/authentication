import { LoginUser } from '@/components/authentication/login/LoginForm';
import { AuthData, Tokens } from '@/types/authentication';
import { ApiResult } from '@/types/response';
import { API_ROUTES, apiClient } from '@/utils/api';
import { extractSetCookieTokens } from '@/utils/preferences/cookies';
import { gracefulFunction } from '@/utils/response';
import { sanitize } from '@/utils/strings';

export class AuthService {
	logoutUser(): Promise<ApiResult<null>> {
		return gracefulFunction(async () => {
			const response = await apiClient.post(API_ROUTES.auth.logout)
				.json<ApiResult<null>>();

			return {
				message: response.message,
				data: null,
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
				json: {
					email,
					password
				}
			}).json<ApiResult<AuthData>>();

			return {
				success: true,
				message: response.message,
				data: response.data
			};
		});
	}

	refreshAccessToken(refreshToken: string): Promise<ApiResult<Tokens>> {
		return gracefulFunction(async () => {
			const response = await apiClient.post(API_ROUTES.auth.refresh, {
				headers: {
					'Cookie': `RefreshToken=${refreshToken}` // Needs to be explicitly set as NextJS middleware does not send the RefreshToken automatically when including credentials
				}
			});

			const tokens = extractSetCookieTokens(response.headers.getSetCookie());

			const data = await response.json<ApiResult<null>>();

			return {
				message: data.message,
				data: {
					...tokens
				}
			};
		});
	}
}
