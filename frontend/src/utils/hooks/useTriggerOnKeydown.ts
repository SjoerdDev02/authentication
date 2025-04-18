import { useEffect } from 'react';

import { KeyboardKeys } from '@/types/keyboard';

export function useTriggerOnKeydown(key: KeyboardKeys, callbackFunction: (e: KeyboardEvent) => void, constraint: boolean = true) {
	useEffect(() => {
		const confirmOnKeydown = (e: KeyboardEvent) => {
			if (constraint && e.key === key) {
				e.preventDefault();

				callbackFunction(e);
			}
		};

		document.addEventListener('keydown', confirmOnKeydown, false);

		return () => {
			document.removeEventListener('keydown', confirmOnKeydown);
		};
	}, [constraint, key, callbackFunction]);
}