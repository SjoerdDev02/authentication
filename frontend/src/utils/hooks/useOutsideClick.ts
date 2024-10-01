import { MutableRefObject, useEffect, useRef } from 'react';

export default function useOutsideClick<T extends HTMLElement>(
	callback: () => void
): MutableRefObject<T | null> {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener('click', handleClick, true);

		return () => {
			document.removeEventListener('click', handleClick, true);
		};
	}, [callback]);

	return ref;
}
