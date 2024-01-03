import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Deferrable } from '@ethersproject/properties';
import { ethers } from 'ethers';
import { EthereumProvider } from 'typings/ethereum.types';

import { PROVIDERS } from 'constants/providers';

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | unknown;

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS;
  instance: ProviderInstance;
};

export type ChainId = string | number;

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export type TokenParams = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
};

export type Chain = {
  chainId: ChainId;
  chainName: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
};

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | string
  | unknown;

export type EthTransactionResponse = ethers.providers.TransactionReceipt;

export type TransactionResponse =
  | EthTransactionResponse
  | unknown;

/**
 * composable object of designated provider,
 * which we can use to solve user needs
 */
export interface ProviderWrapper {
  currentProvider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  currentSigner?: ethers.providers.JsonRpcSigner;

  init: (rpc?: string) => Promise<void>;
  connect?: () => Promise<void>;
  switchChain?: (chainId: ChainId) => Promise<void>;
  switchNetwork?: (chainId: ChainId, chain?: Chain) => Promise<void> | void;
  addChain?: (chain: Chain) => Promise<void>;
  addToken?: (token: TokenParams) => Promise<void>;
  signAndSendTransaction?: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse>;
  getHashFromTxResponse: (txResponse: TransactionResponse) => string;
  getTxUrl: (explorerUrl: string, txHash: string) => string;
  getAddressUrl: (explorerUrl: string, address: string) => string;
  disconnect?: () => Promise<void>;
  signMessage?: (message: string) => Promise<string | undefined>;
}

export type { UseProvider } from 'hooks/useProvider';
