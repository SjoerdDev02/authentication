import * as z from "@zod/mini";

import { apiResultSchema, noDataSchema, unknownDataSchema } from "@/schemas/response";

export type ApiResult<T> = z.infer<ReturnType<typeof apiResultSchema<z.ZodMiniType<T>>>>;

export type NoDataApiResult = z.infer<typeof noDataSchema>;

export type UnknownDataApiResult = z.infer<typeof unknownDataSchema>;