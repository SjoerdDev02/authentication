import { entityMap } from "@/constants/general";

export function sanitize(string: string | FormDataEntryValue) {
	let sanitizedString = String(string).replace(/[&<>"'`=\\/]/g, function (s) {
		return entityMap[s as keyof typeof entityMap];
	});

	if (typeof string === 'string') {
		sanitizedString = sanitizedString.trim();
	}

	return sanitizedString;
}