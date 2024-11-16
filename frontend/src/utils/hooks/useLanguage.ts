'use client'

import { useEffect, useState } from "react";

import preferencesStoreStore from "@/states/preferencesStore";
import { getCookie, setCookie } from "@/utils/preferences/cookies";

import { LanguageType } from "../preferences/preferences";

function useLanguage() {
	const [language, setLanguage] = useState<LanguageType>();

	useEffect(() => {
		if (!language) {
			const initialLanguage = document.documentElement.getAttribute('data-language') as LanguageType;

			if (!getCookie('language')) {
				setCookie('language', initialLanguage, 100);
			}

			// Set the hook state and global state
			setLanguage(initialLanguage);
			preferencesStoreStore.language = initialLanguage;

			return;
		}

		// Set the data-language attribute, hook state and global state
		document.documentElement.setAttribute('data-language', language);

		setCookie('language', language, 5);
		preferencesStoreStore.language = language;
	}, [language]);

	return { language, setLanguage };
}

export default useLanguage;
