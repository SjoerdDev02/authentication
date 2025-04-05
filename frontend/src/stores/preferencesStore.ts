import { create } from "zustand";

import { getClientCookie } from "@/utils/preferences/cookies";
import { LanguageType } from "@/utils/preferences/preferences";

type Preferences = {
    language: LanguageType;
}

type PreferencesStore = {
    preferences: Preferences,
    setPreferences: (preferences: Preferences) => void;
}

const initialLanguage = getClientCookie('language') as LanguageType | null;

const initialPreferences = {
	language: initialLanguage || 'EN'
};

const usePreferencesStore = create<PreferencesStore>((set) => ({
	preferences: initialPreferences,
	setPreferences: (preferences) => set({ preferences })
}));

export default usePreferencesStore;