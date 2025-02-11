import * as crypto from "node:crypto";

export function generateRandomString(maxLength = 20) {
	return crypto.randomBytes(maxLength).toString('hex');
}