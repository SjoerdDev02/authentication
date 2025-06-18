import * as z from '@zod/mini';

import { tokensSchema } from '@/schemas/authentication';

export type Tokens = z.infer<typeof tokensSchema>;
