import { useTranslation } from 'react-i18next';

import { ErrorHandler } from 'helpers';
import styled from 'styled-components';

import Button from 'components/Button';

import useNetworkConfig from 'hooks/useNetworkConfig';

import { useProviderStore } from 'store/provider/hooks';

import { connectorParametersMap } from 'constants/config';

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

  .network-warning__message {
    margin-top: 20px;
  }

  .network-warning__button {
    margin-top: 24px;
    width: 100%;
  }
`;

function NetworkWarning () {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();

  const { chainId } = useNetworkConfig();

  const handleSwitch = async () => {
    if (!currentProvider) return;
    try {
      const qNetwork = connectorParametersMap[chainId];
      await currentProvider.switchNetwork(qNetwork.chainId, qNetwork);
    } catch (error) {
      ErrorHandler.process(error);
    }
  };

  return (
    <StyledWrapper className="block">
      <p className="text-xl font-semibold">
        {t('NETWORK_WARNING_HEADER')}
      </p>
      <p className="network-warning__message text-md color-secondary">
        {t('NETWORK_WARNING_MESSAGE')}
      </p>
      <Button
        alwaysEnabled
        className="network-warning__button"
        onClick={() => handleSwitch()}
      >
        {t('SWITCH_TO_Q')}
      </Button>
    </StyledWrapper>
  );
}

export default NetworkWarning;
