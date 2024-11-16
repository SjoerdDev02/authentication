import axios from 'axios';

export async function registerUser(prevState: any, formData: FormData) {
    try {
        const email = formData.get('email');
        const name = formData.get('name');
        const password = formData.get('password');
        const passwordConfirmation = formData.get('passwordConfirmation');

        if (!email || !name || !password || !passwordConfirmation) {
            return { success: false, message: 'Invalid credentials' };
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
            email,
            name,
            password,
            passwordConfirmation
        });

        return { success: true, message: response.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    try {
        const email = formData.get('email');
        const name = formData.get('name');
        const password = formData.get('password');
        const passwordConfirmation = formData.get('passwordConfirmation');

        if (!email || !name || !password || !passwordConfirmation) {
            return { success: false, message: 'Invalid credentials' };
        }

        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update`, {
            email,
            name,
            password,
            passwordConfirmation
        });

        return { success: true, message: response.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
}

export async function loginUser(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name');
        const password = formData.get('password');

        if (!name || !password) {
            return { success: false, message: 'Invalid credentials' };
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, { name, password });

        return { success: true, message: response.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
}

export async function deleteUser() {
    try {
        const userId = 50;

        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete/${userId}`);

        return { success: true, message: response.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
}

export async function otcUser(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name');
        const password = formData.get('password');

        if (!name || !password) {
            return { success: false, message: 'Invalid credentials' };
        }

        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/otc`, { name, password });

        return { success: true, message: response.data.message };
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' };
    }
}