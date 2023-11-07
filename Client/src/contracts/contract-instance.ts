import { MasterDAORegistryInstance } from '@q-dev/gdk-sdk';
import { DAOInstance } from '@q-dev/gdk-sdk/lib/contracts/DAOInstance';
import { providers, Signer } from 'ethers';

export let daoInstance: DAOInstance | null = null;
export let masterDaoRegistryInstance: MasterDAORegistryInstance | null = null;

export const getDaoInstance = (address: string, signer: Signer | providers.Provider) => {
  daoInstance = new DAOInstance(signer, address);
  return daoInstance;
};

export const resetDaoInstance = () => {
  daoInstance = null;
};

export const getMasterDaoRegistryInstance = (masterDaoFactoryAddress: string, signer: Signer | providers.Provider) => {
  masterDaoRegistryInstance = new MasterDAORegistryInstance(signer, masterDaoFactoryAddress);
  return masterDaoRegistryInstance;
};
