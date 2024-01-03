import { ContractTransaction } from 'ethers';

import { getState } from 'store';

import { AirDropV2 } from 'contracts/AirDropV2';
import { daoInstance } from 'contracts/contract-instance';
interface ClaimParameters {
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
