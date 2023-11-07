import { BaseContractInstance } from '@q-dev/gdk-sdk';
import AirdropV2ABI from 'artifacts/AirDropV2.json';
import BigNumber from 'bignumber.js';
import { ContractTransaction, providers, Signer } from 'ethers';

export class AirDropV2 extends BaseContractInstance<any> {
  constructor (signer: Signer | providers.Provider, address: string) {
    super(signer, AirdropV2ABI, address);
  }

  claimReward (index: any, address: string, proof: string[]): Promise<ContractTransaction> {
    return this.submitTransaction(
      'claimReward',
      [index, address, proof]
    );
  }
}