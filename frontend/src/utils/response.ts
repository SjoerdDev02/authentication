import { ApiResult } from "@/types/response";

export async function gracefulFunction<T>(
	asyncFunction: () => Promise<{ message: string; data: T }>
): Promise<ApiResult<T>> {
	try {
		const { message, data } = await asyncFunction();

		return {
			success: true,
			message,
			data,
		};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred',
			data: null,
		};
	}
}
