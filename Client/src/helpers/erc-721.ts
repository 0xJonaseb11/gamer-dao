
import { QRC721 } from '@q-dev/gdk-sdk';
import { QRC721__factory as Erc721 } from '@q-dev/gdk-sdk/lib/ethers-contracts/factories/QRC721__factory';
import { providers, Signer } from 'ethers';
import { ErrorHandler, handleEthError } from 'helpers';
import { EthProviderRpcError, UseProvider } from 'typings';

export let erc721ContractInstance: QRC721 | null = null;
export let erc721ContractSigner: QRC721 | null = null;

export const getErc721ContractInstance = (address: string, provider?: providers.Provider) => {
  erc721ContractInstance = provider ? Erc721.connect(address, provider) : null;
  return erc721ContractInstance;
};

export const getErc721ContractSigner = (address: string, signer?: Signer) => {
  erc721ContractSigner = signer ? Erc721.connect(address, signer) : null;
  return erc721ContractSigner;
};

export const loadDetailsErc721 = async (provider: UseProvider) => {
  try {
    const [_name, _owner, _symbol, _totalSupply, _balance, _totalSupplyCap, _baseUri] =
      await Promise.all([
        getNameErc721(),
        getOwnerErc721(),
        getSymbolErc721(),
        getTotalSupplyErc721(),
        provider?.selectedAddress ? getBalanceOfErc721(provider.selectedAddress) : '0',
        getTotalSupplyCapErc721(),
        getBaseUriErc721()
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

export const mintToErc721 = async (address: string, amount: string | number, tokenURI: string) => {
  if (!erc721ContractSigner || !address) return;

  try {
    return await erc721ContractSigner?.mintTo(address, amount, tokenURI);
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};
export const setApprovalForAllErc721 = async (address: string, status: boolean) => {
  if (!erc721ContractSigner || !address) return;

  try {
    return await erc721ContractSigner?.setApprovalForAll(address, status);
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export async function getTokenOfOwnerByIndexErc721 (selectedAddress: string, index: string | number) {
  if (!erc721ContractInstance || !selectedAddress) return '';
  try {
    const tokenOfOwnerByIndex = await erc721ContractInstance?.tokenOfOwnerByIndex(selectedAddress, index);
    return tokenOfOwnerByIndex.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
}
export async function getIsApprovedForAllErc721 (tokenAddress: string, selectedAddress: string) {
  if (!erc721ContractInstance || !selectedAddress) return false;
  try {
    return await erc721ContractInstance?.isApprovedForAll(selectedAddress, tokenAddress);
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return false;
  }
}

export const getBalanceOfErc721 = async (address: string) => {
  if (!erc721ContractInstance || !address) return '0';

  try {
    const balance = await erc721ContractInstance.balanceOf(address);
    return balance.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
};

export async function getTotalSupplyCapErc721 () {
  if (!erc721ContractInstance || !erc721ContractInstance?.totalSupplyCap) return '0';

  try {
    const totalSupplyCap = await erc721ContractInstance.totalSupplyCap();
    return totalSupplyCap.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
}

export const getNameErc721 = async () => {
  if (!erc721ContractInstance) return '';

  try {
    return await erc721ContractInstance?.name();
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export const getOwnerErc721 = async () => {
  if (!erc721ContractInstance) return '';

  try {
    return await erc721ContractInstance?.owner();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getErc721OwnerOf = async (id: string) => {
  if (!erc721ContractInstance) return '';

  try {
    return await erc721ContractInstance?.ownerOf(id);
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getBaseUriErc721 = async () => {
  if (!erc721ContractInstance) return '';

  try {
    return await erc721ContractInstance?.baseURI();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '';
  }
};

export const getSymbolErc721 = async () => {
  if (!erc721ContractInstance) return;

  try {
    return await erc721ContractInstance?.symbol();
  } catch (error) {
    handleEthError(error as EthProviderRpcError);
  }
};

export const getTotalSupplyErc721 = async () => {
  if (!erc721ContractInstance) return '0';

  try {
    const totalSupply = await erc721ContractInstance?.totalSupply();
    return totalSupply.toString();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return '0';
  }
};
