import { userSchema } from "@/schemas/user";
import { User } from "@/types/user";

export function isOfTypeUser(data: unknown): data is User {
	return userSchema.safeParse(data).success;
}