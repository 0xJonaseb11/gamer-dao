import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';

import Button from 'components/Button';

import ConnectWalletModal from './components/ConnectWalletModal';

import { StyledCustom } from 'components/styles';

function ConnectWallet () {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  function handleClose () {
    setModalOpen(false);
  }

  function handleOpen () {
    setModalOpen(true);
  }

  return (
    <>
    <StyledCustom>
      <Button
        alwaysEnabled
        onClick={handleOpen}
        className='MetaTheme'
      >
        <Icon name="wallet" />
        <span>{t('CONNECT_WALLET')}</span>
      </Button>
    </StyledCustom>

      <ConnectWalletModal modalOpen={modalOpen} onModalClose={handleClose} />
    </>
  );
}

export default ConnectWallet;
