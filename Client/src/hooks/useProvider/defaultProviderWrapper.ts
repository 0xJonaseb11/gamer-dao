import { Dispatch, SetStateAction } from 'react';

import { ethers } from 'ethers';
import {
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
} from 'helpers';
import {
  ChainId,
  EthProviderRpcError,
  EthTransactionResponse,
  ProviderWrapper,
  TransactionResponse,
} from 'typings';

import { chainIdToNetworkMap, networkConfigsMap } from 'constants/config';

export const defaultProviderWrapper = (
  rpc: string,
  providerStates: {
    selectedAddressState: [string, Dispatch<SetStateAction<string>>];
    chainIdState: [ChainId, Dispatch<SetStateAction<ChainId>>];
  },
): ProviderWrapper => {
  let currentProvider = new ethers.providers.JsonRpcProvider(rpc);

  const [, setSelectedAddress] = providerStates.selectedAddressState;
  const [, setChainId] = providerStates.chainIdState;

  const _updateProviderState = async () => {
    try {
      const network = await currentProvider.detectNetwork();
      setChainId(network.chainId);
      setSelectedAddress('');
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const init = async (rpcUrl?: string) => {
    if (rpcUrl) {
      currentProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    }

    await _updateProviderState();
  };

  const switchNetwork = async (chainId: ChainId) => {
    const networkName = chainIdToNetworkMap[chainId];
    const { rpcUrl } = networkConfigsMap[networkName];
    currentProvider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
    await _updateProviderState();
  };

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    const transactionResponse = txResponse as EthTransactionResponse;

    return transactionResponse.transactionHash;
  };

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    return getEthExplorerTxUrl(explorerUrl, txHash);
  };

  const getAddressUrl = (explorerUrl: string, address: string) => {
    return getEthExplorerAddressUrl(explorerUrl, address);
  };

  return {
    currentProvider,

    init,
    switchNetwork,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
  };
};
