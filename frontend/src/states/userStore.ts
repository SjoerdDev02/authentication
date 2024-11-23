import { proxy } from "valtio";

type UserStoreType = {
    id: number | null,
    name: string | null,
    email: string | null,
};

const userStore: UserStoreType = proxy({
	id: null,
	name: null,
	email: null
});

export default userStore;