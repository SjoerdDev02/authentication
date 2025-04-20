import { unknownDataFieldSchema } from "@/schemas/response";
import { UnknownDataApiResult } from "@/types/response";
import { API_ROUTES, apiClient } from "@/utils/api";
import { gracefulFunction } from "@/utils/response";
import { sanitize } from "@/utils/strings";

export class OTCService {
	otcUser(otc: string) {
		return gracefulFunction(async () => {
			if (!otc) {
				throw new Error('Invalid credentials');
			}
			const sanitizedOtc = sanitize(otc);

			const response = await apiClient.patch(`${API_ROUTES.otc.verify}?otc=${encodeURIComponent(sanitizedOtc)}`)
				.json<UnknownDataApiResult>();

			return {
				success: true,
				message: response.message,
				data: response.data
			};
		}, unknownDataFieldSchema);
	}
}