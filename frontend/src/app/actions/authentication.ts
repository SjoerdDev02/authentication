import axios from 'axios';

import { LoginUser } from '@/components/authentication/login/LoginForm';
import { RegisterUser } from '@/components/authentication/register/RegisterForm';
import { AuthData } from '@/types/authentication';
import { ApiResult } from '@/types/response';
import { UpdateUser } from '@/utils/hooks/updateUser';
import { PasswordResetUser } from '@/utils/hooks/useResetUserPassword';
import { gracefulFunction } from '@/utils/response';
import { sanitize } from '@/utils/strings';

export async function registerUser(
	user: RegisterUser,
): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
	  if (!user.email || !user.name || !user.password || !user.passwordConfirm) {
			throw new Error('Invalid credentials');
	  }

	  const email = sanitize(user.email);
	  const name = sanitize(user.name);
	  const password = sanitize(user.password);
	  const passwordConfirm = sanitize(user.passwordConfirm);

	  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
			email,
			name,
			password,
			passwordConfirm
		}, {
			withCredentials: true
		});

	  return {
			message: response.data.message,
			data: response.data.data,
	  };
	});
}

export async function logoutUser(): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
			{},
			{
				withCredentials: true
			}
		);

	  return {
			message: response.data.message,
			data: response.data.data,
	  };
	});
}

export async function updateUser(user: UpdateUser): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		const id = user.id;
		const name = sanitize(user.name);
		const phone = user.phone ? sanitize(user.phone) : null;
		const email = sanitize(user.email);
		const emailConfirm = user.confirmEmail ? sanitize(user.confirmEmail) : null;
		const password = user.newPassword ? sanitize(user.newPassword) : null;
		const passwordConfirm = user.confirmPassword ? sanitize(user.confirmPassword) : null;

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update`, {
			id,
			name,
			...(phone && { phone }),
			email,
			...(emailConfirm && { emailConfirm }),
			...(password && { password }),
			...(passwordConfirm && { passwordConfirm })
		}, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: null
		};
	});
}

export async function requestResetPasswordToken(user: PasswordResetUser): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		if (!user.email) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		const sanitizedEmail = sanitize(user.email);

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/request_token`, {
			email: sanitizedEmail
		}, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: null
		};
	});
}

export async function resetPasswordUnprotected(user: PasswordResetUser, token: string | null): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		if (!user.newPassword || !user.confirmPassword || !token) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		let resetToken = sanitize(token);
		const sanitizedPassword = sanitize(user.newPassword);
		const sanitizedPasswordConfirm = sanitize(user.confirmPassword);

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset?token=${resetToken}`, {
			password: sanitizedPassword,
			passwordConfirm: sanitizedPasswordConfirm
		}, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: null
		};
	});
}

export async function loginUser(user: LoginUser): Promise<ApiResult<AuthData>> {
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

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
			email,
			password
		}, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: response.data.data
		};
	});
}

export async function deleteUser(): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete`, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: null
		};
	});
}

export async function otcUser(characterOne: string, characterTwo: string, characterThree: string, characterFour: string, characterFive: string, characterSix: string): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		if (!characterOne || !characterTwo || !characterThree || !characterFour || !characterFive || !characterSix) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		const otc = [
			sanitize(characterOne),
			sanitize(characterTwo),
			sanitize(characterThree),
			sanitize(characterFour),
			sanitize(characterFive),
			sanitize(characterSix)
		].join('');

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/otc?otc=${otc}`, undefined, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: response.data.data
		};
	});
}