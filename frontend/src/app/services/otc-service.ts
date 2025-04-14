import { AuthData } from "@/types/authentication";
import { ApiResult } from "@/types/response";
import { API_ROUTES, apiClient } from "@/utils/api";
import { gracefulFunction } from "@/utils/response";
import { sanitize } from "@/utils/strings";

export class OTCService {
	otcUser(otc: string): Promise<ApiResult<AuthData>> {
		return gracefulFunction(async () => {
			if (!otc) {
				return {
					success: false,
					message: 'Invalid credentials',
					data: null
				};
			}

			const sanitizedOtc = sanitize(otc);

			const response = await apiClient.patch(`${API_ROUTES.otc.verify}?otc=${encodeURIComponent(sanitizedOtc)}`)
				.json<ApiResult<AuthData>>();

			return {
				success: true,
				message: response.message,
				data: response.data
			};
		});
	}
}