import { Dropdown, media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const BalanceDropdown = styled(Dropdown)`
  ${media.lessThan('medium')} {
    display: none;
  }

  .balance-content {
    min-width: 240px;
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    box-shadow: 0 4px 4px ${({ theme }) => theme.colors.blockShadowDark},
      0 -1px 2px ${({ theme }) => theme.colors.blockShadowLight};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  }

  .balance {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: space-between;
  }

  .balance-q {
    cursor: default;
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .balance-action {
    padding: 12px 16px;
    background-color: transparent;
    border: none;
    width: 100%;
    display: flex;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }
`;

export const QLogo = styled.div<{ width?: number; margin?: string }>`
  width: ${({ width }) => width || 20}px;
  margin: ${({ margin }) => margin || '0px'};
  display: flex;

  img {
    max-width: 100%;
    height: auto;
  }
`;
