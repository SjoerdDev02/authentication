import { proxy } from "valtio";

export type User = {
    id: number,
    name: string,
    email: string,
    phone: string | null
} | null;

const userStore = proxy<{ user: User }>({
	user: null,
});

export default userStore;