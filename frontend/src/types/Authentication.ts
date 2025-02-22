export type AuthData = {
	id: number,
    name: string,
    email: string,
    phone: string | null
} | null;

export type Tokens = {
	bearer: string | null;
	refreshToken: string | null;
}