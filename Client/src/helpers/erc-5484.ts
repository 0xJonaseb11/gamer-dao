
import { QSBT } from '@q-dev/gdk-sdk';
import { QSBT__factory as Erc5484 } from '@q-dev/gdk-sdk/lib/ethers-contracts/factories/QSBT__factory';
import { providers, Signer } from 'ethers';
import { ErrorHandler, handleEthError } from 'helpers';
import { EthProviderRpcError, UseProvider } from 'typings';

export let erc5484ContractInstance: QSBT | null = null;
export let erc5484ContractSigner: QSBT | null = null;

export const getErc5484ContractInstance = (address: string, provider: providers.Provider) => {
  erc5484ContractInstance = provider ? Erc5484.connect(address, provider) : null;
  return erc5484ContractInstance;
};

export const getErc5484ContractSigner = (address: string, signer?: Signer) => {
  erc5484ContractSigner = signer ? Erc5484.connect(address, signer) : null;
  return erc5484ContractSigner;
};

export const loadErc5484Details = async (provider: UseProvider) => {
  try {
    const [_name, _owner, _symbol, _totalSupply, _balance, _totalSupplyCap, _baseUri] =
      await Promise.all([
        getErc5484Name(),
        getErc5484Owner(),
        getErc5484Symbol(),
        getErc5484TotalSupply(),
        provider?.selectedAddress ? getErc5484BalanceOf(provider.selectedAddress) : '0',
        getErc5484TotalSupplyCap(),
        getErc5484BaseUri()
      ]);
    return {
      decimals: 0,
      name: _name || '',
      owner: _owner || '',
      symbol: _symbol || '',
      totalSupply: _totalSupply || '',
      balance: _balance || '',
      totalSupplyCap: _totalSupplyCap || '',
      baseURI: _baseUri || '',
    };
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
  }
};

export const mintToErc5484 = async (address: string, amount: string | number, tokenURI: string) => {
  if (!erc5484ContractSigner || !address) return;

  try {
    return await erc5484ContractSigner.mintTo(address, amount, tokenURI, 0);
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export const getErc5484BalanceOf = async (address: string) => {
  if (!erc5484ContractInstance || !address) return '0';

  try {
    const balance = await erc5484ContractInstance.balanceOf(address);
    return balance.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
};

export async function getErc5484TotalSupplyCap () {
  if (!erc5484ContractInstance || !erc5484ContractInstance?.totalSupplyCap) return '0';

  try {
    const totalSupplyCap = await erc5484ContractInstance.totalSupplyCap();
    return totalSupplyCap.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
}

export const getErc5484Name = async () => {
  if (!erc5484ContractInstance) return '';

  try {
    return await erc5484ContractInstance.name();
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export const getErc5484Owner = async () => {
  if (!erc5484ContractInstance) return '';

  try {
    return await erc5484ContractInstance.owner();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getErc5484OwnerOf = async (id: string) => {
  if (!erc5484ContractInstance) return '';

  try {
    return await erc5484ContractInstance.ownerOf(id);
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getErc5484Symbol = async () => {
  if (!erc5484ContractInstance) return;

  try {
    return await erc5484ContractInstance.symbol();
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export const getErc5484BaseUri = async () => {
  if (!erc5484ContractInstance) return '';

  try {
    return await erc5484ContractInstance.baseURI();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getErc5484TotalSupply = async () => {
  if (!erc5484ContractInstance) return '0';

  try {
    const totalSupply = await erc5484ContractInstance.totalSupply();
    return totalSupply.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
};
