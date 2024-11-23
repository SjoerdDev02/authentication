import { useEffect } from 'react';

import { KeyboardKeys } from '@/types/KeyboardKeys';

// eslint-disable-next-line no-unused-vars
export function useTriggerOnKeydown(key: KeyboardKeys, callbackFunction?: (e: KeyboardEvent) => void, constraint: boolean = true) {
	useEffect(() => {
		const confirmOnKeydown = (e: KeyboardEvent) => {
			if (constraint && e.key === key && callbackFunction) callbackFunction(e);
		};

		document.addEventListener('keydown', confirmOnKeydown, false);

		return () => {
			document.removeEventListener('keydown', confirmOnKeydown);
		};
	}, [constraint, key, callbackFunction]);
}