
import { useProviderStore } from 'store/provider/hooks';

import { chainIdToNetworkMap, networkConfigsMap, ORIGIN_NETWORK_NAME } from 'constants/config';

function useNetworkConfig () {
  const { currentProvider } = useProviderStore();
  const networkName = currentProvider ? chainIdToNetworkMap[currentProvider?.chainId] : ORIGIN_NETWORK_NAME;

  return networkConfigsMap[networkName || ORIGIN_NETWORK_NAME];
}

export default useNetworkConfig;
