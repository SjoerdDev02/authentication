import { AuthData } from "@/types/authentication";
import { ApiResult } from "@/types/response";
import { API_ROUTES, apiClient } from "@/utils/api";
import { gracefulFunction } from "@/utils/response";
import { sanitize } from "@/utils/strings";

export class OTCService {
	otcUser(characterOne: string, characterTwo: string, characterThree: string, characterFour: string, characterFive: string, characterSix: string): Promise<ApiResult<AuthData>> {
		return gracefulFunction(async () => {
			if (!characterOne || !characterTwo || !characterThree || !characterFour || !characterFive || !characterSix) {
				return {
					success: false,
					message: 'Invalid credentials',
					data: null
				};
			}

			const otc = [
				sanitize(characterOne),
				sanitize(characterTwo),
				sanitize(characterThree),
				sanitize(characterFour),
				sanitize(characterFive),
				sanitize(characterSix)
			].join('');

			const response = await apiClient.patch(`${API_ROUTES.otc.verify}?otc=${encodeURIComponent(otc)}`);

			return {
				success: true,
				message: response.data.message,
				data: response.data.data
			};
		});
	}
}