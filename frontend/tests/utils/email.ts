import ky from "ky";

import { MailpitResponse, MailpitResponseMessage } from "@/e2e/types/email";

export async function getAllEmails() {
	const response = await ky.get('http://localhost:8025/api/v1/messages')
		.json<MailpitResponse>();

	return response;
}

export function getMessageByRecipient(emailResponse: MailpitResponse, recipient: string) {
	const message = emailResponse.messages.filter((message) => message.To[0].Address === recipient)[0];

	if (!message) {
		throw new Error("Could not get message");
	}

	return message;
}

export function extractOtcFromMessage(message: MailpitResponseMessage) {
	const otc = message.Snippet.match(/\b[A-Z0-9]{6}\b(?!.*otc=)/)?.[0];

	return otc;
}

export function extractPasswordResetTokenFromMessage(message: MailpitResponseMessage) {
	const passwordResetToken = message.Snippet.match(/\b[A-Z0-9]{6}\b(?!.*password-reset-token=)/)?.[0];

	return passwordResetToken;
}