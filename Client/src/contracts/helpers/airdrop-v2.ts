import { ContractTransaction } from 'ethers';

import { AirDropV2 } from '../AirDropV2';
import { daoInstance } from '../contract-instance';

import { getState } from 'store';

interface ClaimParameters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index: any;
  address: string;
  proof: string[];
}

export async function claimAirdropReward (params: ClaimParameters): Promise<ContractTransaction> {
  const { currentProvider } = getState().provider;
  if (!currentProvider?.signer || !daoInstance) throw new Error('No signer available');

  const airdropAddress = await daoInstance.DAORegistryInstance.instance.getContract('AirDropV2');

  const contract = new AirDropV2(currentProvider.signer, airdropAddress);
  return contract.claimReward(
    params.index,
    params.address,
    params.proof
  );
}
