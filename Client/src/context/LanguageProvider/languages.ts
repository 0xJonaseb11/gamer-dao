// Icons: https://flagicons.lipis.dev

import datePickerEn from 'date-fns/locale/en-GB';

import en from '../../locales/en-GB.json';

export const EN = { locale: 'en-GB', language: 'English', code: 'en', flagSrc: '/flags/en.svg', localization: datePickerEn };

export const languages = {
  'en-GB': { translation: en },
};

export const languageCodeList = Object.keys(languages);
export const languageList = [EN];
