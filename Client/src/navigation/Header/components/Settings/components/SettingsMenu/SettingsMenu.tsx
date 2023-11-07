import { useTranslation } from 'react-i18next';

import { Switch } from '@q-dev/q-ui-kit';
import { useLanguage } from 'context/LanguageProvider';
import { useTheme } from 'styled-components';

import { SettingsMenuContainer } from './styles';

function LanguageSwitcher ({ onLanguageOpen }: { onLanguageOpen: () => void }) {
  const { isDarkTheme, onChangeTheme } = useTheme();

  const { i18n, t } = useTranslation();
  const { languageList } = useLanguage();
  const language = languageList.find(({ locale }) => locale === i18n.language) || languageList[0];

  return (
    <SettingsMenuContainer>
      <div className="language-block" onClick={onLanguageOpen}>
        <p className="text-lg">{t('LANGUAGE')}</p>

        <div className="language-pick">
          <img
            className="language-pick__flag"
            src={language.flagSrc}
            alt="flag"
          />

          <p className="text-md font-semibold">
            {language.language}
          </p>
        </div>
      </div>

      <Switch
        className="theme-toggle"
        label={t('DARK_THEME')}
        value={isDarkTheme}
        onChange={onChangeTheme}
      />
    </SettingsMenuContainer>
  );
}

export default LanguageSwitcher;
