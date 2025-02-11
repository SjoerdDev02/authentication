import axios from "axios";

import { MailpitResponse, MailpitResponseMessage } from "../types/email";

export async function getAllEmails() {
	const response = await axios.get('http://localhost:8025/api/v1/messages') as MailpitResponse;

	return response;
}

export function getMessageByRecipient(emailResponse: MailpitResponse, recipient: string) {
	const message = emailResponse.data.messages.filter((message) => message.To[0].Address === recipient)[0];

	return message;
}

export function extractOtcFromMessage(message: MailpitResponseMessage) {
	const otc = message.Snippet.match(/\b[A-Z0-9]{6}\b(?!.*otc=)/)?.[0];

	return otc;
}