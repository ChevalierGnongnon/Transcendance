import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english_trans from "./locales/english/translation.json"
import german_trans from "./locales/german/translation.json"
import french_trans from "./locales/french/translation.json" 
import ukrainian_trans from "./locales/ukrainian/translation.json"
import russian_trans from "./locales/russian/translation.json" 

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: english_trans},
        de: {translation: german_trans},
        fr: {translation: french_trans},
        uk: {translation: ukrainian_trans},
        ru: {translation: russian_trans}
    },
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
});

export default i18n;