import ky from "ky";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
	user: {
		register: 'user',
		update: 'user',
		delete: 'user',
		get: 'user',
		resetPasswordRequest: 'user/reset-password/request',
		resetPassword: 'user/reset-password',
	},
	auth: {
		login: 'auth',
		logout: 'auth/logout',
		refresh: 'auth/token',
	},
	otc: {
		verify: 'otc/verify',
	},
};

export const apiClient = ky.create({
	prefixUrl: API_BASE,
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json',
	},
});