import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dropdown, Icon, Modal } from '@q-dev/q-ui-kit';
import { formatNumberCompact } from '@q-dev/utils';
import { ErrorHandler } from 'helpers';
import styled from 'styled-components';

import ExplorerAddress from 'components/Custom/ExplorerAddress';

import MintForm from './components/MintForm';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useProviderStore } from 'store/provider/hooks';

import { fromWeiWithDecimals } from 'utils/numbers';

const StyledWrapper = styled.div`
  padding: 16px 16px 16px 24px;

  .dao-token-supply__header {
    min-height: 32px;
  }

  .dao-token-supply__menu {
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    display: grid;
    width: max-content;
    min-width: 156px;
    padding: 4px 0;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
    box-shadow:
      0 4px 4px ${({ theme }) => theme.colors.blockShadowDark},
      0 -1px 2px ${({ theme }) => theme.colors.blockShadowLight};
  }

  .dao-token-supply__menu-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .dao-token-supply__menu-item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    transition: background-color 100ms ease-out;
    background-color: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }

  .dao-token-supply__menu-icon {
    width: 20px;
    height: auto;
  }

  .dao-token-supply__val {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
  }

  .dao-token-supply__contract {
    margin-top: 16px;
    display: flex;
    gap: 4px;
  }
`;

function DaoTokenSupply () {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();
  const { tokenInfo } = useDaoTokenStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isErc20Token = useMemo(() => tokenInfo?.type === 'erc20', [tokenInfo]);
  const isTokenOwner = useMemo(() => tokenInfo?.owner === currentProvider?.selectedAddress,
    [tokenInfo, currentProvider?.selectedAddress]);

  async function addTokenToWallet () {
    if (!currentProvider?.provider || !tokenInfo || !isErc20Token) return;
    try {
      await currentProvider.addToken(
        {
          address: tokenInfo.address,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        }
      );
    } catch (error) {
      ErrorHandler.process(error);
    }
  }

  return (
    <StyledWrapper className="block">
      <div className="block__header dao-token-supply__header">
        <h2 className="text-lg">🪙 Dao Token Supply</h2>

        {(isErc20Token || isTokenOwner) && <Dropdown
          right
          open={isMenuOpen}
          trigger={(
            <Button
              icon
              className="dao-token-supply__menu-btn"
              look="ghost"
              active={isMenuOpen}
            >
              <Icon name="more-vertical" />
            </Button>
          )}
          onToggle={setIsMenuOpen}
        >
          <div className="dao-token-supply__menu">
            {isErc20Token && <button
              className="dao-token-supply__menu-item text-md"
              onClick={addTokenToWallet}
            >
              <img
                className="dao-token-supply__menu-icon"
                src="/icons/metamask.svg"
                alt="metamask"
              />
              <span>{t('ADD_TO_WALLET')}</span>
            </button>}
            {isTokenOwner && (
              <button
                className="dao-token-supply__menu-item text-md"
                onClick={() => setIsModalOpen(true)}
              >
                <Icon name="coins" />
                {t('MINT_TOKENS')}
              </button>
            )}
          </div>
        </Dropdown>}
      </div>

      <div className="dao-token-supply__val">
        {
          !tokenInfo || tokenInfo.type === 'native'
            ? <p className="text-xl font-semibold">-</p>
            : <>
              <p className="text-xl font-semibold" title={fromWeiWithDecimals(tokenInfo.totalSupply, tokenInfo.decimals)}>
                {formatNumberCompact(
                  fromWeiWithDecimals(tokenInfo.totalSupply, tokenInfo.decimals), tokenInfo.formatNumber
                )}
              </p>
              <p className="text-xl font-semibold">{tokenInfo.symbol}</p>
            </>
        }
      </div>

      <div className="dao-token-supply__contract text-sm">
        <span className="font-light">{t('CONTRACT')}</span>
        <ExplorerAddress short address={tokenInfo?.address || ''} />
      </div>

      <Modal
        open={isModalOpen}
        title={t('MINT')}
        onClose={() => setIsModalOpen(false)}
      >
        <MintForm onSubmit={() => setIsModalOpen(false)} />
      </Modal>
    </StyledWrapper>
  );
}

export default DaoTokenSupply;
