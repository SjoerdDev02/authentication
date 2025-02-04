import { useEffect, useState } from "react";

export function useHasChanges(initialObject: object, updatedObject: object) {
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		const stringifiedInitialObject = JSON.stringify(initialObject);
		const stringifiedUpdatedObject = JSON.stringify(updatedObject);

		setHasChanges(stringifiedInitialObject !== stringifiedUpdatedObject);
	}, [initialObject, updatedObject]);

	return hasChanges;
}