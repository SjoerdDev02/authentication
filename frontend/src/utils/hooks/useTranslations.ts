"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeKey } from "valtio/utils";

import preferencesStoreStore from "@/stores/preferencesStore";

import { getDynamicNestedProperties } from "../objects";
import { getClientCookie } from "../preferences/cookies";

function useTranslations(initialTranslations = {}) {
	const initialLanguage = getClientCookie("language") || "EN";
	const [language, setLanguage] = useState(initialLanguage);
	const [translations, setTranslations] = useState(initialTranslations);

	const getTranslation = useCallback((translationProperty: string) => {
		return getDynamicNestedProperties(translationProperty, translations) || "";
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

	subscribeKey(preferencesStoreStore, "language", (newLanguage) => {
		setLanguage(newLanguage);
	});

	useEffect(() => {
		if (language.toLowerCase() !== Object.keys(translations)[0].toLowerCase()) {
			fetchTranslations(language);
		}
	}, [language]);

	return getTranslation;
}

export default useTranslations;