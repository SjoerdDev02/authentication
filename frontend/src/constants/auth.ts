import { AuthData } from "@/types/authentication";
import { ApiResult } from "@/types/response";

export const initialAuthFormState: ApiResult<AuthData> = {
	success: true,
	message: '',
	data: null
};

export const REFRESH_EXPIRATION_SECONDS = 28800; // 8 hours
export const BEARER_EXPIRATION_SECONDS = 600; // 10 minutes