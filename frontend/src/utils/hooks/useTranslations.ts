"use client";

import { useCallback, useEffect, useState } from "react";

import usePreferencesStore from "@/stores/preferencesStore";
import { TranslationKey } from "@/types/translations";
import { getDynamicNestedProperties } from "@/utils/objects";
import { getClientCookie } from "@/utils/preferences/cookies";

function useTranslations(initialTranslations = {}) {
	const languageStoreState = usePreferencesStore((state) => state.preferences.language);

	const initialLanguage = getClientCookie("language") || "EN";
	const [language, setLanguage] = useState(initialLanguage);
	const [translations, setTranslations] = useState(initialTranslations);

	const getTranslation = useCallback((translationProperty: TranslationKey) => {
	  return getDynamicNestedProperties(translationProperty, translations);
	}, [translations]);

	const fetchTranslations = useCallback(async (lang: string) => {
		try {
			const response = await fetch(`/translations/${lang.toLowerCase()}.json`);

			if (!response.ok) {
				throw new Error(`Failed to fetch translations: ${response.statusText}`);
			}

			const data = await response.json();

			setTranslations(data);
		} catch (error) {
			console.error("Error fetching translations:", error);
		}
	}, []);

	useEffect(() => {
		setLanguage(languageStoreState);
	}, [languageStoreState]);

	useEffect(() => {
		if (language.toLowerCase() !== Object.keys(translations)[0].toLowerCase()) {
			fetchTranslations(language);
		}
	}, [language]);

	return getTranslation;
}

export default useTranslations;