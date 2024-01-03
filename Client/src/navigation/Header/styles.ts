import { media } from '@q-dev/q-ui-kit';
import styled, { css } from 'styled-components';

export const StyledHeader = styled.header<{isSelectPage: boolean}>`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  height: 72px;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  
  .header__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 32px;

    ${media.lessThan('medium')} {
      padding: 16px;
    }
  }

  .header__logo-wrp {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .header__left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .header__logo {
    width: 40px;
    transform: scale(1.5);
  }

  .header__actions-network,
  .header__network {
    ${media.lessThan('medium')} {
      display: none;
    }
  }

  .header__menu {
    display: none;

    ${media.lessThan('medium')} {
      display: inline-flex;
    }
  }

  .header__actions {
    display: flex;
    gap: 8px;
  }

  .header__transactions {
    ${media.lessThan('large')} {
      display: none;
    }
  }

  ${({ isSelectPage }) => isSelectPage && css`
    .header__menu {
      display: inline-flex;
    }
  `};
`;
