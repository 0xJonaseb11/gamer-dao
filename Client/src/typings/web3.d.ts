import { EthereumProvider } from 'typings';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
