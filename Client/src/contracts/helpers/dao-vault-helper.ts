import { toBigNumber } from '@q-dev/utils';

import { TokenInfo } from 'store/dao-token/reducer';

import { toWeiWithDecimals } from 'utils/numbers';

const DEFAULT_GAS_PRICE = '0.04';

export function getDAOVaultDepositAmount (
  amount: string,
  balance: string,
  qBalance:string,
  token: TokenInfo) {
  switch (token.type) {
    case 'native':
      return getSpendAmountForNativeToken(balance, token.address);
    case 'erc20':
      return getSpendAmountForErc20(amount, balance, qBalance, token);
    case 'erc721':
      return getSpendAmountForErc721(amount, balance, token, qBalance);
    case 'erc5484':
      return getSpendAmountForErc5484(balance, qBalance);
    default:
      throw new Error('Unknown token type');
  }
}

export function getSpendAmountForErc5484 (balance: string, qBalance: string) {
  if (!Number(balance) || !Number(qBalance)) { return { balance: '0', canDeposit: false }; }
  return {
    balance,
    canDeposit: checkIsCanDeposit(qBalance)
  };
}

export function getSpendAmountForErc721 (amount: string, balance: string, token: TokenInfo, qBalance: string) {
  if (!token.address) { return { balance: '0', canDeposit: false }; }
  if (!token.isErc721Approved || !amount) return { balance, canDeposit: true };
  return {
    balance,
    canDeposit: checkIsCanDeposit(qBalance)
  };
}

export function getSpendAmountForErc20 (
  amount: string, balance: string, qBalance:string, token: TokenInfo) {
  if (!token || !token?.address || !token?.allowance) { return { balance: '0', canDeposit: false }; }
  const amountInWei = toWeiWithDecimals(amount, token.decimals);
  if (
    toBigNumber(token.allowance).isLessThanOrEqualTo(0) ||
      toBigNumber(amountInWei).isGreaterThanOrEqualTo(token.allowance) ||
      !amount
  ) return { balance, canDeposit: true };
  return {
    balance,
    canDeposit: checkIsCanDeposit(qBalance)
  };
}

export function getSpendAmountForNativeToken (balance: string, address: string) {
  if (!address) { return { balance: '0', canDeposit: false }; }
  const calcAmount = toBigNumber(balance).minus(DEFAULT_GAS_PRICE);
  if (calcAmount.isLessThanOrEqualTo(0)) return { balance, canDeposit: false };
  return {
    balance: toBigNumber(balance).minus(DEFAULT_GAS_PRICE).toString(),
    canDeposit: checkIsCanDeposit(balance)
  };
}

export function checkIsCanDeposit (balance: string) {
  return toBigNumber(balance).isGreaterThan(DEFAULT_GAS_PRICE);
}
