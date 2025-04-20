import * as z from '@zod/mini';

export const userSchema = z.nullable(z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	phone: z.nullable(z.string())
}));

