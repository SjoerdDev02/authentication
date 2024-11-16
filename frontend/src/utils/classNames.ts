/**
 * Utility to generate class names for flexible wrappers.
 * @param baseAndAdditional - A list of class names (base and additional classes).
 * @param modifiers - An object where keys are class names and values are conditions (truthy to include).
 * @returns A combined string of class names.
 */
const generateClassNames = (
	...baseAndAdditional: [...string[], Record<string, boolean | undefined>]
): string => {
	const modifiers = baseAndAdditional.pop() as Record<string, boolean | undefined>;

	const classes = [...baseAndAdditional];

	Object.entries(modifiers).forEach(([className, condition]) => {
		if (condition) {
			classes.push(className);
		}
	});

	return classes.join(' ');
};

export default generateClassNames;
