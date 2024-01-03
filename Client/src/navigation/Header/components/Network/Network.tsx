import { useTranslation } from 'react-i18next';

import { SegmentedButton } from '@q-dev/q-ui-kit';
import { useWeb3Context } from 'context/Web3ContextProvider';
import { ErrorHandler } from 'helpers';

import { useProviderStore } from 'store/provider/hooks';

import { connectorParametersMap, networkConfigsMap } from 'constants/config';
import { PROVIDERS } from 'constants/providers';

import { StyledCustom } from 'components/styles';


function Network () {
  const { currentProvider } = useProviderStore();
  const { t } = useTranslation();
  const { initDefaultProvider } = useWeb3Context();

 

  const networkOptions = [
    { value: 35443, label: t('TESTNET') },
  ];

  const handleChangeNetwork = async (chainId: number) => {
    if (!currentProvider) return;
    try {
      if (currentProvider.selectedProvider !== PROVIDERS.default) {
        const chainInfo = connectorParametersMap[chainId];
        await currentProvider.switchNetwork(chainId, chainInfo);
        return;
      }
      await initDefaultProvider(chainId);
    } catch (error) {
      ErrorHandler.process(error);
    }
  };

  return <StyledCustom>
  <SegmentedButton
    value={Number(currentProvider?.chainId)}
    options={networkOptions}
    onChange={handleChangeNetwork}
  />
  </StyledCustom>;
}

export default Network;
