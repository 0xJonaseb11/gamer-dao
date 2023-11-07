import { Dispatch, SetStateAction } from 'react';

import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Deferrable } from '@ethersproject/properties';
import { ethers } from 'ethers';
import {
  connectEthAccounts,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  requestAddErc20,
  requestAddEthChain,
  requestSwitchEthChain
} from 'helpers';
import {
  Chain,
  ChainId,
  EthProviderRpcError,
  EthTransactionResponse,
  ProviderInstance,
  ProviderWrapper,
  TokenParams,
  TransactionResponse,
  TxRequestBody,
} from 'typings';

export const metamaskWrapper = (
  provider: ProviderInstance,
  providerStates: {
    selectedAddressState: [string, Dispatch<SetStateAction<string>>];
    chainIdState: [ChainId, Dispatch<SetStateAction<ChainId>>];
  },
): ProviderWrapper => {
  const currentProvider = new ethers.providers.Web3Provider(
    provider as ethers.providers.ExternalProvider,
    'any',
  );
  const currentSigner = currentProvider.getSigner();

  const [, setSelectedAddress] = providerStates.selectedAddressState;
  const [, setChainId] = providerStates.chainIdState;

  const _updateProviderState = async () => {
    try {
      const network = await currentProvider.detectNetwork();
      setChainId(network.chainId);

      const currentAccounts = await currentProvider.listAccounts();
      setSelectedAddress(currentAccounts[0]);
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const _setListeners = () => {
    const tempProviderStub = currentProvider.provider as {
      on: (eventName: string, cb: () => void) => void;
    };

    tempProviderStub.on('accountsChanged', () => {
      _updateProviderState();
    });
    tempProviderStub.on('chainChanged', () => {
      _updateProviderState();
    });
    tempProviderStub.on('disconnect', () => {
      setSelectedAddress('');
    });
  };

  const init = async () => {
    _setListeners();
    await _updateProviderState();
  };

  const connect = async () => {
    try {
      await connectEthAccounts(currentProvider);
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const switchChain = async (chainId: ChainId) => {
    try {
      await requestSwitchEthChain(currentProvider, Number(chainId));
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const addChain = async (chain: Chain) => {
    try {
      await requestAddEthChain(currentProvider, chain);
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const addToken = async (token: TokenParams) => {
    try {
      await requestAddErc20(currentProvider, token);
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const switchNetwork = async (chainId: ChainId, chain?: Chain) => {
    try {
      try {
        await requestSwitchEthChain(currentProvider, Number(chainId));
      } catch (error) {
        const code = (error as EthProviderRpcError).code;
        if ((code === 4902 || code === -32603) && chain) {
          try {
            await requestAddEthChain(currentProvider, chain);
          } catch (error) {
            // eslint-disable-next-line no-throw-literal
            throw error as EthProviderRpcError;
          }
        }
      }
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  const signAndSendTransaction = async (txRequestBody: TxRequestBody) => {
    try {
      const transactionResponse = await currentSigner.sendTransaction(
        txRequestBody as Deferrable<TransactionRequest>,
      );

      return transactionResponse.wait();
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
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

  const signMessage = async (message: string) => {
    try {
      const signer = currentProvider.getSigner();
      const msg = await signer.signMessage(message);
      return msg;
    } catch (error) {
      handleEthError(error as EthProviderRpcError);
    }
  };

  return {
    currentProvider,
    currentSigner,

    init,
    connect,
    switchChain,
    addChain,
    switchNetwork,
    signAndSendTransaction,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
    signMessage,
    addToken
  };
};
