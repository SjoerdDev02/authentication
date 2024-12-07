import axios from 'axios';

export async function registerUser(prevState: any, formData: FormData) {
	try {
		const email = formData.get('email');
		const name = formData.get('name');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirmation');

		if (!email || !name || !password || !passwordConfirm) {
			return { success: false, message: 'Invalid credentials', data: null };
		}

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
			email,
			name,
			password,
			passwordConfirm
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
		const email = formData.get('email');
		const name = formData.get('name');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirmation');

		if (!userId) {
			return { success: false, message: 'Invalid credentials' };
		}

		if (
			(!email && !name)
            && (!password && !passwordConfirm)
		) {
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
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return { success: false, message: 'Invalid credentials', data: null };
		}

		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
			email,
			password
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
		const characterOne = formData.get('characterOne');
		const characterTwo = formData.get('characterTwo');
		const characterThree = formData.get('characterThree');
		const characterFour = formData.get('characterFour');
		const characterFive = formData.get('characterFive');
		const characterSix = formData.get('characterSix');

		if (!characterOne || !characterTwo || !characterThree || !characterFour || !characterFive || !characterSix) {
			return { success: false, message: 'Invalid credentials', data: null };
		}

		const otc = [
			characterOne,
			characterTwo,
			characterThree,
			characterFour,
			characterFive,
			characterSix
		].join('');

		const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/otc?otc=${otc}`);

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