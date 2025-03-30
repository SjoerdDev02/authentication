import ky from "ky";

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

const isProduction = process.env.NODE_ENV === "production";

const API_BASE = isProduction && typeof window === 'undefined'
	? process.env.API_BASE_URL
	: process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = ky.create({
	prefixUrl: API_BASE,
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json',
	},
});