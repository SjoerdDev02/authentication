import { useRef } from "react";

import { ElementType } from "@/types/elements";

export const useRefs = <T extends ElementType>() => {
	const refs = useRef<Record<string | number, T | null>>({});

	const setRef = (element: T | null, key: string | number) => {
		refs.current[key] = element;
	};

	return {
		refs: refs.current,
		setRef
	};
};