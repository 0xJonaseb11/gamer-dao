import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';
import { useLanguage } from 'context/LanguageProvider';

import { LanguagesContainer } from './styles';

function Languages ({ onBack }: { onBack: () => void }) {
  const { languageList, changeLang } = useLanguage();
  const { i18n } = useTranslation();

  const changeLanguage = (val: string) => {
    changeLang(val);
    onBack();
  };

  return (
    <LanguagesContainer>
      {languageList.map(({ locale, language, flagSrc }) => (
        <div
          key={locale}
          className="language-option"
          onClick={() => changeLanguage(locale)}
        >
          <Icon
            name="check"
            className="language-option__check"
            style={{ opacity: locale === i18n.language ? 1 : 0 }}
          />

          <div className="language-option__main">
            <img
              className="language-option__flag"
              src={flagSrc}
              alt="lang"
            />

            <p
              className="text-md"
              style={{ fontWeight: locale === i18n.language ? 600 : 400 }}
            >
              {language}
            </p>
          </div>
        </div>
      ))}
    </LanguagesContainer>
  );
}

export default Languages;
