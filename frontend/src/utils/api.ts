import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
	user: {
		register: `${API_BASE}/user`,
		update: `${API_BASE}/user`,
		delete: `${API_BASE}/user`,
		get: `${API_BASE}/user`,
		resetPasswordRequest: `${API_BASE}/user/reset-password/request`,
		resetPassword: `${API_BASE}/user/reset-password`,
	},
	auth: {
		login: `${API_BASE}/auth`,
		logout: `${API_BASE}/auth/logout`,
		refresh: `${API_BASE}/auth/token`,
	},
	otc: {
		verify: `${API_BASE}/otc/verify`,
	},
};

export const apiClient = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});
