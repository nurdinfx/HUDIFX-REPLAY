import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'RU' | 'BR';

interface LanguageState {
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            currentLanguage: 'EN',
            setLanguage: (lang) => set({ currentLanguage: lang }),
        }),
        {
            name: 'hudifx-language',
        }
    )
);
