import * as z from "@zod/mini";

import { apiResultSchema } from "@/schemas/response";

export async function gracefulFunction<T extends z.ZodMiniType>(
	asyncFunction: () => Promise<{ message: string; data: z.infer<T> }>,
	dataSchema: T
) {
	try {
		const response = await asyncFunction();

		console.log({ response });

		const validatedData = response.data
			? dataSchema.parse(response.data)
			: null;

		const result = apiResultSchema(dataSchema).parse({
			success: true,
			message: response.message,
			data: validatedData
		});

		return result;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return {
			success: false,
			message: error.response?.data?.message || 'An error occurred',
			data: null
		};
	}
}