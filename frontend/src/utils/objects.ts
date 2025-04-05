// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDynamicNestedProperties(nestedPropertiesString: string, object: Record<string, any>): any {
	const keys = nestedPropertiesString.split('.');
	let propertyValue = object;

	for (const key of keys) {
	  propertyValue = propertyValue && propertyValue[key];
	}

	return propertyValue || '';
}
