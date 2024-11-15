'use server';

export async function registerUser(prevState: any, formData: FormData) {
	await new Promise(resolve => setTimeout(resolve, 1000));

	const email = formData.get('email');
	const name = formData.get('name');
	const password = formData.get('password');
	const passwordConfirmation = formData.get('passwordConfirmation');

	if (email && name && password && passwordConfirmation) {
		return { success: true, message: 'Registered successful!' };
	} else {
		return { success: false, message: 'Invalid credentials' };
	}
}

export async function updateUser(prevState: any, formData: FormData) {
	await new Promise(resolve => setTimeout(resolve, 1000));

	const email = formData.get('email');
	const name = formData.get('name');
	const password = formData.get('password');
	const passwordConfirmation = formData.get('passwordConfirmation');

	if (email && name && password && passwordConfirmation) {
		return { success: true, message: 'Updated successful!' };
	} else {
		return { success: false, message: 'Invalid credentials' };
	}
}

export async function loginUser(prevState: any, formData: FormData) {
	await new Promise(resolve => setTimeout(resolve, 1000));

	const name = formData.get('name');
	const password = formData.get('password');

	if (name && password) {
		return { success: true, message: 'Login successful!' };
	} else {
		return { success: false, message: 'Invalid credentials' };
	}
}

export async function deleteUser() {
	await new Promise(resolve => setTimeout(resolve, 1000));

	const userId = 50;

	if (userId) {
		return { success: true, message: 'Deleted successful!' };
	} else {
		return { success: false, message: 'Invalid credentials' };
	}
}

export async function otcUser(prevState: any, formData: FormData) {
	await new Promise(resolve => setTimeout(resolve, 1000));

	const name = formData.get('name');
	const password = formData.get('password');

	if (name && password) {
		return { success: true, message: 'Login successful!' };
	} else {
		return { success: false, message: 'Invalid credentials' };
	}
}