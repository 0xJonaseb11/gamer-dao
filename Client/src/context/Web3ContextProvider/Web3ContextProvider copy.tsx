import React from "react";
import { createContext, FC, ReactElement, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "@q-dev/react-hooks";
import { ErrorHandler } from "helpers";
import { UseProvider, useProvider, useWeb3 } from "hooks";
import { Wrap } from "./styles";

import { chainIdToNetworkMap, networkConfigsMap, ORIGIN_NETWORK_NAME } from "constants/config";
import { PROVIDERS } from "constants/providers";
import { Web3Context } from "./Web3ContextProvider";
import { useMotionTemplate } from "framer-motion";
import { defaultMaxListeners } from "events";

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

  
}
