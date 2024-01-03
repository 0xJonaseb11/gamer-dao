import { createContext, ReactNode, useCallback, useContext } from 'react';
import { registerLocale } from 'react-datepicker';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import datePickerDe from 'date-fns/locale/de';
import datePickerEn from 'date-fns/locale/en-GB';
import datePickerUk from 'date-fns/locale/uk';
import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { register } from 'timeago.js';
import timeAgoDeLang from 'timeago.js/lib/lang/de';
import timeAgoEnLang from 'timeago.js/lib/lang/en_US';
import timeAgoUkLang from 'timeago.js/lib/lang/uk';

import { languageCodeList, languageList, languages } from './languages';

registerLocale('en-GB', datePickerEn);
registerLocale('de-DE', datePickerDe);
registerLocale('uk-UA', datePickerUk);

register('en-GB', timeAgoEnLang);
register('de-DE', timeAgoDeLang);
register('uk-UA', timeAgoUkLang);

const LanguageContext = createContext({
  languageList,
  changeLang: (_: string) => {},
});

function LanguageProvider ({ children }: { children: ReactNode }) {
  i18n
    .use(detector)
    .use(initReactI18next)
    .init({
      resources: languages,
      fallbackLng: 'en-GB',
      supportedLngs: languageCodeList,
      interpolation: {
        escapeValue: false,
      },
    });

  const changeLang = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute('lang', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ languageList, changeLang }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
