import { AuthData } from "@/types/authentication";
import { ApiResult } from "@/types/response";

export const initialAuthFormState: ApiResult<AuthData> = {
	success: true,
	message: '',
	data: null
};