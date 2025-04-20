import * as z from '@zod/mini';

import { userSchema } from '@/schemas/user';

export type User = z.infer<typeof userSchema>;