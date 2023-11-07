import BN from 'bn.js';

export interface TimeLockEntry {
  amount: string;
  releaseStart: number | string | BN;
  releaseEnd: number | string | BN;
}

export interface DaoCardType {
  title: string;
  description: string;
  image: string;
  address: string;
}

export interface TimeLockInfoStruct {
  lockedAmount: string;
  unlockTime: string;
  withdrawalAmount: string;
}

export interface SupportedDaoNetwork {
  isDaoExist: boolean;
  chainId: number;
}

export interface DecodedCallData {
  functionName: string;
  arguments: Record<string, string>;
}
