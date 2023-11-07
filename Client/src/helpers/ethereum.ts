import { toBigNumber } from '@q-dev/utils';
import { errors } from 'errors';
import { ethers, utils } from 'ethers';
import { Chain, EthProviderRpcError, TokenParams } from 'typings';

export function isAddress (value: string) {
  return utils.isAddress(value);
}

export function isBytesLike (value: string) {
  return utils.isBytesLike(value);
}

export function singlePrecision (amount?: string | number) {
  return amount ? toBigNumber(amount).div(1e25).toString() : '0';
}

export enum EIP1193 {
  userRejectedRequest = 4001,
  unauthorized = 4100,
  unsupportedMethod = 4200,
  disconnected = 4900,
  chainDisconnected = 4901,
}

export enum EIP1193String {
  userRejectedRequest = 'ACTION_REJECTED',
  failedEstimateGas = 'UNPREDICTABLE_GAS_LIMIT',
}

export enum EIP1474 {
  parseError = -32700,
  invalidRequest = -32600,
  methodNotFound = -32601,
  invalidParams = -32602,
  internalError = -32603,
  invalidInput = -32000,
  resourceNotFound = -32001,
  resourceUnavailable = -32002,
  transactionRejected = -32003,
  methodNotSupported = -32004,
  limitExceeded = -32005,
  jsonRpcVersionNotSupported = -32006,
}

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  await provider.send('eth_requestAccounts', []);
};

export async function requestSwitchEthChain (
  provider: ethers.providers.Web3Provider,
  chainId: number,
) {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ]);
}

export async function requestAddErc20 (
  provider: ethers.providers.Web3Provider,
  { address, symbol, decimals, image }: TokenParams
) {
  await provider.send('wallet_watchAsset', {
    // @ts-ignore: Ethers type error
    type: 'ERC20',
    options: {
      address: address,
      symbol: symbol,
      decimals: decimals,
      image: image!,
    },
  });
}

export async function requestAddEthChain (
  provider: ethers.providers.Web3Provider,
  chain: Chain
) {
  await provider.send('wallet_addEthereumChain', [chain]);
}

export function handleEthError (error: EthProviderRpcError) {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
    case EIP1193String.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest();
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized();
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod();
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected();
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected();
    case EIP1474.parseError:
      throw new errors.ProviderParseError();
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest();
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound();
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams();
    case EIP1474.internalError:
      throw new errors.ProviderInternalError();
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput();
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound();
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable();
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected();
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported();
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded();
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported();
    default:
      throw error;
  }
}

export function getEthExplorerTxUrl (explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`;
}

export function getEthExplorerAddressUrl (explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`;
}
