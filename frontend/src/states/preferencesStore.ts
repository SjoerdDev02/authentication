import { proxy } from "valtio";

import { getClientCookie } from "@/utils/preferences/cookies";
import { LanguageType } from "@/utils/preferences/preferences";

type PreferencesStoreType = {
    language: LanguageType;
}

const initialLanguage = getClientCookie('language') as LanguageType | null;

const preferencesStoreStore: PreferencesStoreType = proxy({
	language: initialLanguage || 'ES'
});

export default preferencesStoreStore;