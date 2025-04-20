import { RegisterUser } from "@/components/authentication/register/RegisterForm";
import { noDataFieldSchema } from "@/schemas/response";
import { userSchema } from "@/schemas/user";
import { ApiResult, NoDataApiResult } from "@/types/response";
import { User } from "@/types/user";
import { API_ROUTES, apiClient } from "@/utils/api";
import { UpdateUser } from "@/utils/hooks/updateUser";
import { PasswordResetUser } from "@/utils/hooks/useResetUserPassword";
import { gracefulFunction } from "@/utils/response";
import { sanitize } from "@/utils/strings";

export class UserService {
	getUser(bearerToken?: string, refreshToken?: string) {
		return gracefulFunction(async () => {
			if (!bearerToken || !refreshToken) {
				throw new Error('Invalid credentials');
			};

			const response = await apiClient.get(API_ROUTES.user.get, {
				headers: {
					'Cookie': `RefreshToken=${refreshToken}; Bearer=${bearerToken}`
				}
			}).json<ApiResult<User>>();

			return {
				success: true,
				message: response.message,
				data: response.data
			};
		}, userSchema);
	}

	registerUser(user: RegisterUser) {
		return gracefulFunction(async () => {
			if (!user.email || !user.name || !user.password || !user.passwordConfirm) {
				throw new Error('Invalid credentials');
			}

			const email = sanitize(user.email);
			const name = sanitize(user.name);
			const password = sanitize(user.password);
			const passwordConfirm = sanitize(user.passwordConfirm);

			const response = await apiClient.post(API_ROUTES.user.register, {
				json: {
					email,
					name,
					password,
					passwordConfirm
				}
			}).json<ApiResult<User>>();

			return {
				message: response.message,
				data: response.data,
			};
		}, userSchema);
	}

	updateUser(user: UpdateUser) {
		return gracefulFunction(async () => {
			const id = user.id;
			const name = sanitize(user.name);
			const phone = user.phone ? sanitize(user.phone) : null;
			const email = sanitize(user.email);
			const emailConfirm = user.confirmEmail ? sanitize(user.confirmEmail) : null;
			const password = user.newPassword ? sanitize(user.newPassword) : null;
			const passwordConfirm = user.confirmPassword ? sanitize(user.confirmPassword) : null;

			const response = await apiClient.patch(API_ROUTES.user.update, {
				json: {
					id,
					name,
					...(phone && { phone }),
					email,
					...(emailConfirm && { emailConfirm }),
					...(password && { password }),
					...(passwordConfirm && { passwordConfirm })
				}
			}).json<NoDataApiResult>();

			return {
				success: true,
				message: response.message,
				data: null
			};
		}, noDataFieldSchema);
	}

	deleteUser() {
		return gracefulFunction(async () => {
			const response = await apiClient.delete(API_ROUTES.user.delete)
				.json<NoDataApiResult>();

			return {
				success: true,
				message: response.message,
				data: null
			};
		}, noDataFieldSchema);
	}

	requestResetPasswordToken(user: PasswordResetUser) {
		return gracefulFunction(async () => {
			if (!user.email) {
				return {
					success: false,
					message: 'Invalid credentials',
					data: null
				};
			}

			const sanitizedEmail = sanitize(user.email);

			const response = await apiClient.post(API_ROUTES.user.resetPasswordRequest, {
				json: {
					email: sanitizedEmail
				}
			}).json<NoDataApiResult>();

			return {
				success: true,
				message: response.message,
				data: null
			};
		}, noDataFieldSchema);
	}

	resetPasswordWithToken(user: PasswordResetUser, token: string | null) {
		return gracefulFunction(async () => {
			if (!user.newPassword || !user.confirmPassword || !token) {
				return {
					success: false,
					message: 'Invalid credentials',
					data: null
				};
			}

			const resetToken = sanitize(token);
			const sanitizedPassword = sanitize(user.newPassword);
			const sanitizedPasswordConfirm = sanitize(user.confirmPassword);

			const response = await apiClient.patch(`${API_ROUTES.user.resetPassword}?token=${encodeURIComponent(resetToken)}`, {
				json: {
					password: sanitizedPassword,
					passwordConfirm: sanitizedPasswordConfirm
				}
			}).json<NoDataApiResult>();

			return {
				success: true,
				message: response.message,
				data: null
			};
		}, noDataFieldSchema);
	}
}