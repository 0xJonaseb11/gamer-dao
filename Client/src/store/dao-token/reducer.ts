import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TokenType = 'native' | 'erc20' | 'erc721' | 'erc5484';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  type: TokenType;
  address: string;
  totalSupply: string;
  totalSupplyCap: string;
  owner: string;
  formatNumber: number;
  isErc721Approved?: boolean;
  isAuthorizedBySBT?: boolean;
  allowance?: string;
  baseURI?: string;
};

interface DaoTokenState {
  votingToken: string;
  tokenInfo: TokenInfo | null;
};

const initialState: DaoTokenState = {
  votingToken: '',
  tokenInfo: null
};

const daoTokenSlice = createSlice({
  name: 'dao-token',
  initialState,
  reducers: {
    setVotingToken: (state, { payload }: PayloadAction<string>) => {
      state.votingToken = payload;
    },
    setTokenInfo: (state, { payload }: PayloadAction<TokenInfo | null>) => {
      state.tokenInfo = payload;
    },
  }
});

export const { setVotingToken, setTokenInfo } = daoTokenSlice.actions;
export default daoTokenSlice.reducer;
