import { createContext, FC, ReactElement, useContext, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from '@q-dev/react-hooks';
import { ErrorHandler } from 'helpers';

import { UseProvider, useProvider, useWeb3 } from 'hooks';

import { Wrap } from './styles';

import { chainIdToNetworkMap, networkConfigsMap, ORIGIN_NETWORK_NAME } from 'constants/config';
import { PROVIDERS } from 'constants/providers';

export type Web3Data = {
  currentProvider: UseProvider;
  isRightNetwork: boolean;
  isWeb3Loaded: boolean;
  connect: (provider: PROVIDERS) => Promise<void>;
  initDefaultProvider: (rpc: number) => Promise<void>;
  disconnect: () => void;
};

export const Web3Context = createContext({} as Web3Data);

const Web3ContextProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const web3 = useWeb3();
  const metamaskProvider = useProvider();
  const defaultProvider = useProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useLocalStorage<undefined | PROVIDERS>('selectedProvider', undefined);

  const providers = useMemo(
    () => [metamaskProvider, defaultProvider],
    [metamaskProvider, defaultProvider],
  );

  const currentProvider = useMemo(() => {
    const selectProvider = providers.find(el => el?.selectedProvider === selectedProvider && el.selectedAddress);
    return selectProvider || defaultProvider;
  }, [metamaskProvider, defaultProvider, selectedProvider]);

  const isRightNetwork = useMemo(() => Boolean(currentProvider?.chainId &&
    chainIdToNetworkMap[currentProvider?.chainId]), [currentProvider]);

  const initWeb3Providers = async () => {
    try {
      await web3.init();
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      setIsLoadFailed(true);
    }
  };

  const initProviderWrappers = async () => {
    if (!web3.isWeb3Init) return;
    setIsLoaded(false);
    try {
      const metamaskBrowserProvider = web3.providers.find(
        (el: { name: PROVIDERS }) => el.name === PROVIDERS.metamask,
      );
      if (metamaskBrowserProvider) {
        await metamaskProvider.init(metamaskBrowserProvider);
      }

      await initDefaultProvider(networkConfigsMap[ORIGIN_NETWORK_NAME].chainId);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      setIsLoadFailed(true);
    }
    setIsLoaded(true);
  };

  const initProviderWrapper = async (provider: UseProvider) => {
    if (!web3.isWeb3Init) return;
    try {
      const browserProvider = web3.providers.find(
        (el: { name: PROVIDERS }) => el.name === provider.selectedProvider,
      );
      if (browserProvider) {
        await provider.init(browserProvider);
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  };

  const initDefaultProvider = async (network: number) => {
    if (!web3.isWeb3Init) return;
    try {
      const selectedNetworkName = chainIdToNetworkMap[network];
      await defaultProvider.init({ name: PROVIDERS.default, instance: networkConfigsMap[selectedNetworkName].rpcUrl });
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  };

  const connect = async (provider: PROVIDERS) => {
    const foundProvider = providers.find(item => item.selectedProvider === provider);
    if (foundProvider && !foundProvider?.provider) {
      await initProviderWrapper(foundProvider);
    }
    if (foundProvider && !foundProvider.isConnected) {
      await foundProvider.connect();
    }
    setSelectedProvider(provider);
  };

  const disconnect = () => {
    const filteredProviders = providers.filter(item => item.selectedProvider !== currentProvider.selectedProvider);
    setSelectedProvider(filteredProviders[0].selectedProvider);
    currentProvider.disconnect();
  };

  useEffect(() => {
    initWeb3Providers();
  }, []);

  useEffect(() => {
    initProviderWrappers();
  }, [web3.providers, web3.isWeb3Init]);

  if (isLoadFailed) {
    return (
      <Wrap>
        <div>
          <p>Init error</p>
          <p>Please, refresh the page</p>
        </div>
      </Wrap>
    );
  }

  return (
    <Web3Context.Provider
      value={{
        currentProvider,
        isRightNetwork,
        isWeb3Loaded: isLoaded,
        connect,
        initDefaultProvider,
        disconnect
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => useContext(Web3Context);

export default Web3ContextProvider;
