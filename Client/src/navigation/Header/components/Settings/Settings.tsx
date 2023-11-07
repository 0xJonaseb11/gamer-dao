import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';
import { motion } from 'framer-motion';

import Button from 'components/Button';

import Languages from './components/Languages';
import SettingsMenu from './components/SettingsMenu';
import { SettingsDropdown } from './styles';

function Settings () {
  const { t } = useTranslation();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleSettingsToggle = (val: boolean) => {
    setSettingsOpen(val);
    if (!val) return;

    setIsLanguageOpen(false);
  };

  return (
    <SettingsDropdown
      right
      open={settingsOpen}
      trigger={
        <Button
          alwaysEnabled
          icon
          look="secondary"
          active={settingsOpen}
        >
          <motion.span style={{ height: '100%' }} animate={{ rotate: settingsOpen ? 90 : 0 }}>
            <Icon name="settings" />
          </motion.span>
        </Button>
      }
      onToggle={handleSettingsToggle}
    >
      <div className="settings-content">
        <h3 className="settings-title text-xl font-semibold">{isLanguageOpen ? t('LANGUAGE') : t('SETTINGS')}</h3>
        {isLanguageOpen
          ? (
            <Languages onBack={() => setIsLanguageOpen(false)} />
          )
          : (
            <SettingsMenu onLanguageOpen={() => setIsLanguageOpen(true)} />
          )}
      </div>

    </SettingsDropdown>
  );
}

export default Settings;
