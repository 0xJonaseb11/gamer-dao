import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useWeb3Context } from 'context/Web3ContextProvider';
import { ErrorHandler, isMobile } from 'helpers';

import Button from 'components/Button';

import { PROVIDERS } from 'constants/providers';

const METAMASK_DOWNLOAD_LINK = 'https://metamask.io/download';

function ConnectButtons () {
  const { t } = useTranslation();
  const { connect } = useWeb3Context();
  const [isLoading, setIsLoading] = useState(false);
  const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;

  const connectWallet = async (provider: PROVIDERS) => {
    setIsLoading(true);
    try {
      await connect(provider);
    } catch (error) {
      ErrorHandler.process(error, t('ERROR_WHILE_CONNECTING_TO_WALLET'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  if (isLoading) {
    return <div className="connect-loading">{t('LOADING')}</div>;
  }

  return (
    <div className="connect-buttons">
      {window.ethereum?.isMetaMask
        ? (
          <Button
            alwaysEnabled
            style={{ width: '100%' }}
            onClick={() => connectWallet(PROVIDERS.metamask)}
          >
            <img
              src="/icons/metamask.svg"
              alt="metamask"
              className="connect-buttons__icon"
            />
            <span>{t('CONNECT_WITH_METAMASK')}</span>
          </Button>
        )
        : (
          <a
            href={isMobile() ? METAMASK_APP_CONNECT_URL : METAMASK_DOWNLOAD_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <Button
              alwaysEnabled
              block
              style={{ width: '100%' }}
            >
              <img
                src="/icons/metamask.svg"
                alt="metamask"
                className="connect-buttons__icon"
              />
              <span>{isMobile() ? t('GO_TO_METAMASK') : t('INSTALL_METAMASK')}</span>
            </Button>
          </a>
        )}
    </div>
  );
}

export default ConnectButtons;
