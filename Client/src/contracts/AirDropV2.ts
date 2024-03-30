/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseContractInstance } from '@q-dev/gdk-sdk';
import AirdropV2ABI from 'artifacts/AirDropV2.json';
// eslint-disable-next-line unused-imports/no-unused-imports
import BigNumber from 'bignumber.js';
import { ContractTransaction, providers, Signer } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AirDropV2 extends BaseContractInstance<any> {
  constructor (signer: Signer | providers.Provider, address: string) {
    super(signer, AirdropV2ABI, address);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claimReward (index: any, address: string, proof: string[]): Promise<ContractTransaction> {
    return this.submitTransaction(
      'claimReward',
      [index.address, proof]
    );
  }
}
