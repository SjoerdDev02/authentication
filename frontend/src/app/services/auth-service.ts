import { LoginUser } from '@/components/authentication/login/LoginForm';
import { noDataFieldSchema } from "@/schemas/response";
import { userSchema } from '@/schemas/user';
import { ApiResult, NoDataApiResult } from '@/types/response';
import { User } from '@/types/user';
import { API_ROUTES, apiClient } from '@/utils/api';
import { gracefulFunction } from '@/utils/response';
import { sanitize } from '@/utils/strings';

export class AuthService {
	logoutUser() {
		return gracefulFunction(async () => {
			const response = await apiClient.post(API_ROUTES.auth.logout)
				.json<NoDataApiResult>();

			return {
				message: response.message,
				data: null,
			};
		}, noDataFieldSchema);
	}

	loginUser(user: LoginUser) {
		return gracefulFunction(async () => {
			if (!user.email || !user.password) {
				throw new Error('Invalid credentials');
			}
			const email = sanitize(user.email);
			const password = sanitize(user.password);

			const response = await apiClient.post(API_ROUTES.auth.login, {
				json: {
					email,
					password
				}
			}).json<ApiResult<User>>();

			return {
				message: response.message || 'Login successful',
				data: response.data
			};
		}, userSchema);
	}

	// TODO: Uncomment this and use it in middleware when Zod Mini had fixed dynamic code evaluation in Edge Runtime environments
	// refreshAccessToken(refreshToken: string) {
	// 	return gracefulFunction(async () => {
	// 		const response = await apiClient.post(API_ROUTES.auth.refresh, {
	// 			headers: {
	// 				'Cookie': `RefreshToken=${refreshToken}` // Needs to be explicitly set as NextJS middleware does not send the RefreshToken automatically when including credentials
	// 			}
	// 		});

	// 		const tokens = extractSetCookieTokens(response.headers.getSetCookie());

	// 		const data = await response.json<NoDataApiResult>();

	// 		return {
	// 			message: data.message,
	// 			data: tokens
	// 		};
	// 	}, tokensSchema);
	// }
}
