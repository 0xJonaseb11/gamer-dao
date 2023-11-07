import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';
import { useWeb3Context } from 'context/Web3ContextProvider/Web3ContextProvider';
import copy from 'copy-to-clipboard';
import styled from 'styled-components';

import { useProviderStore } from 'store/provider/hooks';

const WalletBaseInfoWrapper = styled.div`
   .wallet-base-info__address-button {
    padding: 12px 20px;
    background-color: transparent;
    border: none;
    width: 100%;
    display: flex;
    gap: 12px;
    white-space: nowrap;

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }


  .wallet-base-info__address-button-icon {
    font-size: 20px;
  }
`;

interface Props {
  onClick: () => void;
}

function WalletBaseInfo ({ onClick }: Props) {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();
  const { disconnect } = useWeb3Context();
  const [isCopied, setIsCopied] = useState(false);

  function copyAddress () {
    if (!currentProvider) return;
    copy(currentProvider.selectedAddress);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  return (
    <WalletBaseInfoWrapper>
      <button
        type="button"
        className="wallet-base-info__address-button text-lg color-primary"
        onClick={onClick}
      >
        <i className="mdi mdi-swap-horizontal wallet-base-info__address-button-icon" />
        <span>{t('USER_TRANSACTIONS')}</span>
      </button>
      <button
        type="button"
        className="wallet-base-info__address-button text-lg color-primary"
        onClick={copyAddress}
      >
        <Icon name="copy" />
        <span>{isCopied ? t('COPIED') : t('COPY_ADDRESS')}</span>
      </button>

      <button
        type="button"
        className="wallet-base-info__address-button text-lg color-primary"
        onClick={() => disconnect()}
      >
        <Icon name="sign-out" />
        <span>{t('DISCONNECT_WALLET')}</span>
      </button>
    </WalletBaseInfoWrapper>
  );
}

export default WalletBaseInfo;
