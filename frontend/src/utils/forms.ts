export function sanitizeTextInput(input: string): string {
	return input.trim().replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&': return '&amp;';
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '"': return '&quot;';
			case "'": return '&#039;';
			default: return '';
		}
	});
}