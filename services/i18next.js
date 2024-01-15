import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import vn from '../locales/vn.json';

const languageResources = {
    en: { translation: en },
    vn: { translation: vn },
};

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'vn',
    fallbackLng: 'vn',
    resources: languageResources,
});

export default i18next;
