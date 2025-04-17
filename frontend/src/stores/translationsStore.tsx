"use client";

import { createContext, type ReactNode, useContext } from "react";

import { TranslationKey } from "@/types/translations";
import useTranslations from "@/utils/hooks/useTranslations";

const TranslationsContext = createContext<(translationProperty: TranslationKey) => string>(() => '');

export function TranslationsProvider({
	children,
	initialTranslations,
}: {
  children: ReactNode;
  initialTranslations: Record<string, string>;
}) {
	const getTranslation = useTranslations(initialTranslations);

	return (
		<TranslationsContext.Provider value={getTranslation}>
			{children}
		</TranslationsContext.Provider>
	);
}

export function useTranslationsContext() {
	return useContext(TranslationsContext);
}