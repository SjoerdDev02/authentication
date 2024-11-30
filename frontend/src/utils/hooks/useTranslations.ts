import { useEffect, useState } from "react";
import { subscribeKey } from "valtio/utils";

import preferencesStoreStore from "@/states/preferencesStore";
import { getDynamicNestedProperties } from "@/utils/objects";

import { getClientCookie } from "../preferences/cookies";

function useTranslations() {
	const initialLanguage = getClientCookie('language');

	const [language, setLanguage] = useState(initialLanguage);
	const [translations, setTranslations] = useState({});

	function getTranslation(translationProperty: string) {
		const propertyTranslation = getDynamicNestedProperties(translationProperty, translations) || '';

		return propertyTranslation;
	}

	subscribeKey(preferencesStoreStore, 'language', (newLanguage) =>
		setLanguage(newLanguage)
	);

	useEffect(() => {
		const fetchTranslations = async () => {
			try {
				const response = await fetch(`/translations/${language?.toLocaleLowerCase()}.json`);

				if (!response.ok) {
					throw new Error(`Failed to fetch translations: ${response.statusText}`);
				}

				const data = await response.json();

				setTranslations(data);
			} catch (error) {
				console.error('Error fetching translations:', error);
			}
		};

		if (language) {
			fetchTranslations();
		}
	}, [language]);

	return getTranslation;
}

export default useTranslations;