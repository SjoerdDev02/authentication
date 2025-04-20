import * as z from '@zod/mini';

export const tokensSchema = z.object({
	bearer: z.nullable(z.string()),
	refreshToken: z.nullable(z.string()),
});