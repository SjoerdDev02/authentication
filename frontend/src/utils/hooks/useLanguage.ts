'use client';

import { useEffect, useState } from "react";

import usePreferencesStore from "@/stores/preferencesStore";
import { getClientCookie, setCookie } from "@/utils/preferences/cookies";
import { LanguageType } from "@/utils/preferences/preferences";

function useLanguage() {
	const setPreferences = usePreferencesStore((state) => state.setPreferences);

	const [language, setLanguage] = useState<LanguageType>();

	useEffect(() => {
		if (!language) {
			const initialLanguage = document.documentElement.getAttribute('data-language') as LanguageType;

			if (!getClientCookie('language')) {
				setCookie('language', initialLanguage, 100);
			}

			setLanguage(initialLanguage);
			setPreferences({
				language: initialLanguage
			});

			return;
		}

		document.documentElement.setAttribute('data-language', language);

		setCookie('language', language, 5);
		setPreferences({
			language
		});
	}, [language]);

	return { language, setLanguage };
}

export default useLanguage;
