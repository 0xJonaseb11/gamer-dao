import { useCallback, useMemo, useRef, useState } from 'react';

import { LogLevel } from '@ethersproject/logger';
import { errors } from 'errors';
import { ethers } from 'ethers';
import { isEqual } from 'lodash';
import {
  Chain,
  ChainId,
  DesignatedProvider,
  ProviderWrapper,
  TokenParams,
  TransactionResponse,
  TxRequestBody,
} from 'typings';

import { defaultProviderWrapper, metamaskWrapper } from 'hooks/useProvider';

import { PROVIDERS } from 'constants/providers';

export interface UseProvider {
  provider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  signer?: ethers.providers.JsonRpcSigner;

  init: (provider: DesignatedProvider) => Promise<void>;
  disconnect: () => void;
  chainId: ChainId;
  selectedAddress: string;
  switchChain: (chainId: ChainId) => Promise<void>;
  switchNetwork: (chainId: ChainId, chain?: Chain) => Promise<void>;
  addChain: (chain: Chain) => Promise<void>;
  addToken: (token: TokenParams) => Promise<void>;
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>;
  isConnected: boolean;
  selectedProvider: PROVIDERS | undefined;
  connect: () => Promise<void>;
  getHashFromTxResponse: (txResponse: TransactionResponse) => string;
  getTxUrl: (explorerUrl: string, txHash: string) => string;
  getAddressUrl: (explorerUrl: string, address: string) => string;
}

export const useProvider = (): UseProvider => {
  const providerWrp = useRef<ProviderWrapper | undefined>();

  const provider = useMemo(
    () => providerWrp.current?.currentProvider,
    [providerWrp.current],
  );

  const signer = useMemo(
    () => providerWrp.current?.currentSigner,
    [providerWrp.current],
  );

  const [selectedProvider, setSelectedProvider] = useState<PROVIDERS | undefined>();
  const [chainId, setChainId] = useState<ChainId>('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const isConnected = useMemo(
    () => Boolean(chainId && selectedAddress),
    [chainId, selectedAddress],
  );

  const init = useCallback(async (provider: DesignatedProvider) => {
    let newState;
    switch (provider.name as PROVIDERS) {
      case PROVIDERS.metamask:
        newState = metamaskWrapper(provider.instance, {
          selectedAddressState: [selectedAddress, setSelectedAddress],
          chainIdState: [chainId, setChainId],
        });
        break;
      case PROVIDERS.default:
        newState = defaultProviderWrapper(provider.instance as string, {
          selectedAddressState: [selectedAddress, setSelectedAddress],
          chainIdState: [chainId, setChainId],
        });
        break;
      default:
        throw new Error('Invalid Provider');
    }
    if (!isEqual(providerWrp.current, newState)) {
      providerWrp.current = newState;
      setSelectedProvider(provider.name);
      await providerWrp.current?.init();
    }
  }, [providerWrp]);

  const connect = useCallback(async () => {
    if (!providerWrp.current || !providerWrp.current?.connect) throw new errors.ProviderWrapperMethodNotFoundError();
    await providerWrp.current?.connect();
  }, [providerWrp.current]);

  const switchChain = useCallback(
    async (chainId: ChainId) => {
      if (!providerWrp.current ||
        !providerWrp.current?.switchChain) throw new errors.ProviderWrapperMethodNotFoundError();

      await providerWrp.current.switchChain(chainId);
    },
    [providerWrp.current],
  );

  const addChain = useCallback(
    async (chain: Chain) => {
      if (!providerWrp.current ||
        !providerWrp.current?.addChain) { throw new errors.ProviderWrapperMethodNotFoundError(); };

      await providerWrp.current.addChain(chain);
    },
    [providerWrp.current],
  );

  const addToken = useCallback(
    async (token: TokenParams) => {
      if (!providerWrp.current ||
        !providerWrp.current?.addToken) { throw new errors.ProviderWrapperMethodNotFoundError(); };

      await providerWrp.current.addToken(token);
    },
    [providerWrp.current],
  );

  const switchNetwork = useCallback(
    async (chainId: ChainId, chain?: Chain) => {
      if (!providerWrp.current ||
        !providerWrp.current?.switchNetwork) { throw new errors.ProviderWrapperMethodNotFoundError(); };

      await providerWrp.current.switchNetwork(chainId, chain);
    },
    [providerWrp.current],
  );

  const disconnect = useCallback(() => {
    providerWrp.current = undefined;
    setChainId('');
    setSelectedAddress('');
  }, []);

  const signAndSendTx = useCallback(
    (txRequestBody: TxRequestBody) => {
      if (!providerWrp.current ||
        !providerWrp.current?.signAndSendTransaction) throw new errors.ProviderWrapperMethodNotFoundError();

      return providerWrp.current.signAndSendTransaction(txRequestBody);
    },
    [providerWrp],
  );

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    if (!providerWrp.current) throw new errors.ProviderWrapperMethodNotFoundError();

    return providerWrp.current.getHashFromTxResponse(txResponse);
  };

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    if (!providerWrp.current) throw new errors.ProviderWrapperMethodNotFoundError();

    return providerWrp.current.getTxUrl(explorerUrl, txHash);
  };

  const getAddressUrl = (explorerUrl: string, address: string) => {
    if (!providerWrp.current) throw new errors.ProviderWrapperMethodNotFoundError();

    return providerWrp.current.getAddressUrl(explorerUrl, address);
  };

  ethers.utils.Logger.setLogLevel(LogLevel.OFF); // Fix for duplicate definition for Compound ABI

  return {
    provider,
    signer,

    selectedProvider,
    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    switchChain,
    switchNetwork,
    addChain,
    disconnect,
    signAndSendTx,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
    addToken
  };
};
