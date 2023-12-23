import React from "react";
import { createContext, FC, ReactElement, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "@q-dev/react-hooks";
import { ErrorHandler } from "helpers";
import { UseProvider, useProvider, useWeb3 } from "hooks";
import { Wrap } from "./styles";

import { chainIdToNetworkMap, networkConfigsMap, ORIGIN_NETWORK_NAME } from "constants/config";
import { PROVIDERS } from "constants/providers";
import { networkInterfaces } from "os";
import { Provider } from "react-redux";


export type Web3Data = {
  currentProvider: UseProvider;
  isRightNetwork: boolean;
  isWeb3Loaded: boolean;
  
  connect: (provider: PROVIDERS) => Promise<void>;
  initDefaultProvider: (rpc: number) => Promise<void>;
  disconnect: () => void;
};

export const Web3Context = createContext({} as Web3Data);

const Web3ContextProvider: FC<{ children: ReactElement }>  = ({ children }) => {
  const web3 = useWeb3();
  const metamaskProvider = useProvider();
  const defaultProvider = useProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useLocalStorage<undefined | PROVIDERS>('selectedProvider', undefined);

  const providers = useMemo(
    () => [metamaskProvider , defaultProvider],  [metamaskProvider, defaultProvider],
  );

  const currentProvider = useMemo(() => {
    const selectProvider = providers.find(el => el?.selectedProvider === selectedProvider && el.selectedAddress);
    return selectedProvider || defaultProvider;
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
        (el: { name: PROVIDERS}) => el.name === PROVIDERS.metamask,
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

  const 


}
