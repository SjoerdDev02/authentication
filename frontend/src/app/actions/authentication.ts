import axios from 'axios';

import { sanitize } from '@/utils/strings';

export async function registerUser(prevState: any, formData: FormData) {
	try {
		let email = formData.get('email');
		let name = formData.get('name');
		let password = formData.get('password');
		let passwordConfirm = formData.get('passwordConfirmation');

		if (!email || !name || !password || !passwordConfirm) {
			return { success: false, message: 'Invalid credentials', data: null };
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
			success: true,
			message: response.data.message,
			data: response.data
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred',
			data: null
		};
	}
}

export async function updateUser(prevState: any, formData: FormData, userId: number | null) {
	try {
		const id = userId;
		let email = formData.get('email');
		let name = formData.get('name');
		let password = formData.get('password');
		let passwordConfirm = formData.get('passwordConfirmation');

		if (!userId) {
			return { success: false, message: 'Invalid credentials' };
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
				message: 'Invalid credentials'
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
			message: response.data.message
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred'
		};
	}
}

export async function loginUser(prevState: any, formData: FormData) {
	try {
		let email = formData.get('email');
		let password = formData.get('password');

		if (!email || !password) {
			return { success: false, message: 'Invalid credentials', data: null };
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
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred',
			data: null
		};
	}
}

export async function deleteUser() {
	try {
		const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete`, {
			withCredentials: true
		});

		return {
			success: true,
			message: response.data.message
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred'
		};
	}
}

export async function otcUser(prevState: any, formData: FormData) {
	try {
		let characterOne = formData.get('characterOne');
		let characterTwo = formData.get('characterTwo');
		let characterThree = formData.get('characterThree');
		let characterFour = formData.get('characterFour');
		let characterFive = formData.get('characterFive');
		let characterSix = formData.get('characterSix');

		if (!characterOne || !characterTwo || !characterThree || !characterFour || !characterFive || !characterSix) {
			return { success: false, message: 'Invalid credentials', data: null };
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
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred',
			data: null
		};
	}
}