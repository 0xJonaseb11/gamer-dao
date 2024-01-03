import { useTranslation } from 'react-i18next';

import styled from 'styled-components';

import ConnectWallet from 'navigation/Header/components/ConnectWallet';

export const StyledWrapper = styled.div`
  position: fixed;
  z-index: 10000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: max-content;
  max-width: 375px;
  padding: 32px;
  pointer-events: all;

  .connect-wallet-warning__message {
    margin-top: 20px;
  }

  .connect-wallet-warning__actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    width: 100%;
  }
`;

function ConnectWalletWarning () {
  const { t } = useTranslation();

  return (
    <StyledWrapper className="block">
      <p className="text-xl font-semibold">
        {t('NETWORK_NOT_CONNECT_HEADER')}
      </p>
      <p className="connect-wallet-warning__message text-md color-secondary">
        {t('NETWORK_NOT_CONNECT_MESSAGE')}
      </p>
      <div className="connect-wallet-warning__actions">
        <ConnectWallet />
      </div>
    </StyledWrapper>
  );
}

export default ConnectWalletWarning;
