import axios from 'axios';

import { AuthData } from '@/types/authentication';
import { ApiResult } from '@/types/response';
import { gracefulFunction } from '@/utils/response';
import { sanitize } from '@/utils/strings';

export async function registerUser(
	prevState: any,
	formData: FormData
): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
	  let email = formData.get('email');
	  let name = formData.get('name');
	  let password = formData.get('password');
	  let passwordConfirm = formData.get('passwordConfirmation');

	  if (!email || !name || !password || !passwordConfirm) {
			throw new Error('Invalid credentials');
	  }

	  email = sanitize(email);
	  name = sanitize(name);
	  password = sanitize(password);
	  passwordConfirm = sanitize(passwordConfirm);

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
			data: response.data,
	  };
	});
}

export async function updateUser(prevState: any, formData: FormData, userId: number | null): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		const id = userId;
		let email = formData.get('email');
		let name = formData.get('name');
		let password = formData.get('password');
		let passwordConfirm = formData.get('passwordConfirmation');

		if (!userId) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		if (!!email && !!name) {
			email = sanitize(email);
			name = sanitize(name);
		} else if (!!password && !!passwordConfirm) {
			password = sanitize(password);
			passwordConfirm = sanitize(passwordConfirm);
		} else {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update`, {
			id,
			...(email && { email }),
			...(name && { name }),
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

export async function requestResetPasswordToken(prevState: any, formData: FormData): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		let email = formData.get('email');

		if (!!email) {
			email = sanitize(email);
		} else {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/request_token`, {
			email
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

export async function resetPasswordUnprotected(prevState: any, formData: FormData, token: string | null): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		let resetToken = token;
		let password = formData.get('newPassword');
		let passwordConfirm = formData.get('newPasswordConfirmation');

		if (!!resetToken && !!password && !!passwordConfirm) {
			resetToken = sanitize(resetToken);
			password = sanitize(password);
			passwordConfirm = sanitize(passwordConfirm);
		} else {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset?token=${resetToken}`, {
			password,
			passwordConfirm
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

export async function loginUser(prevState: any, formData: FormData): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		let email = formData.get('email');
		let password = formData.get('password');

		if (!email || !password) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		email = sanitize(email);
		password = sanitize(password);

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
			email,
			password
		}, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: response.data
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

export async function otcUser(prevState: any, formData: FormData): Promise<ApiResult<AuthData>> {
	return gracefulFunction(async () => {
		let characterOne = formData.get('characterOne');
		let characterTwo = formData.get('characterTwo');
		let characterThree = formData.get('characterThree');
		let characterFour = formData.get('characterFour');
		let characterFive = formData.get('characterFive');
		let characterSix = formData.get('characterSix');

		if (!characterOne || !characterTwo || !characterThree || !characterFour || !characterFive || !characterSix) {
			return {
				success: false,
				message: 'Invalid credentials',
				data: null
			};
		}

		characterOne = sanitize(characterOne);
		characterTwo = sanitize(characterTwo);
		characterThree = sanitize(characterThree);
		characterFour = sanitize(characterFour);
		characterFive = sanitize(characterFive);
		characterSix = sanitize(characterSix);

		const otc = [
			characterOne,
			characterTwo,
			characterThree,
			characterFour,
			characterFive,
			characterSix
		].join('');

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/otc?otc=${otc}`, undefined, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message,
			data: response.data
		};
	});
}