import { proxy } from "valtio";

import { getCookie } from "@/utils/preferences/cookies";
import { LanguageType } from "@/utils/preferences/preferences";

type PreferencesStoreType = {
    language: LanguageType;
}

const initialLanguage = getCookie('language') as LanguageType | null;

const preferencesStoreStore: PreferencesStoreType = proxy({
	language: initialLanguage || 'ES'
});

export default preferencesStoreStore;