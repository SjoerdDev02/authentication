import * as z from "@zod/mini";

export const apiResultSchema = <T extends z.ZodMiniType>(schema: T) => z.object({
	success: z.boolean(),
	message: z.string(),
	data: schema,
});

export const noDataFieldSchema = z.null();
export const noDataSchema = apiResultSchema(noDataFieldSchema);

export const unknownDataFieldSchema = z.unknown();
export const unknownDataSchema = apiResultSchema(unknownDataFieldSchema);