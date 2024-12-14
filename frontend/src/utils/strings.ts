import { entityMap } from "@/app/constants/general";

export function sanitize(string: string | FormDataEntryValue) {
	let sanitized_string = String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s as keyof typeof entityMap];
	});

	if (typeof string === 'string') {
		sanitized_string = sanitized_string.trim();
	}

	return sanitized_string;
}