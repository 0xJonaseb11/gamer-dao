import { toBigNumber } from '@q-dev/utils';
import { BigNumber } from "bignumber.js";
import { utils } from 'ethers';

export function toWeiWithDecimals (value: number | string, decimals = 0) {
  return toBigNumber(value)
    .multipliedBy(10 ** decimals)
    .toFixed();
}

export function fromWeiWithDecimals (value: number | string, decimals = 0) {
  return toBigNumber(value)
    .dividedBy(10 ** decimals)
    .toFixed();
}

export function toBN(value: string | number | BigNumber | bigint) {
  if (typeof value === 'bigint') {
    value = value.toString();
  }

  return new BigNumber(value);
}

export function wei(value: string | number | bigint, decimal: number = 18): bigint {
  if (typeof value === 'number' || typeof value === 'bigint') {
    value = value.toString();
  }

  return utils.parseUnits(value as string, decimal).toBigInt();
}
