import * as crypto from "node:crypto";

export function generateRandomString(maxLength = 20) {
	return crypto.randomBytes(maxLength).toString('hex');
}

export function generateRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}