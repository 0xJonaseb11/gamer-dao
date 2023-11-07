
import { TypeOptions } from 'react-toastify';

import styled from 'styled-components';

export const Container = styled.div<{
  $type: TypeOptions;
}>`
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  box-shadow:
    0 8px 12px 6px ${({ theme }) => theme.colors.blockShadowDark},
    0 4px 4px ${({ theme }) => theme.colors.blockShadowLight};
  border-radius: 16px;
  display: grid;
  grid-template-columns: auto 1fr;
  max-width: 342px;
  width: 100%;
  overflow: hidden;

  &::before {
    content: '';
    display: flex;
    width: 14px;
    height: 100%;
    background-color: ${({ theme, $type }) => {
      switch ($type) {
        case 'success':
          return theme.colors.successMain;
        case 'error':
          return theme.colors.errorMain;
        case 'info':
        case 'default':
        case 'warning':
          return theme.colors.infoPrimary;
      }
    }};
  }

  .notification-manager__icon-wrp {
    color: ${({ theme, $type }) => {
      switch ($type) {
        case 'success':
          return theme.colors.successMain;
        case 'error':
          return theme.colors.errorMain;
        case 'info':
        case 'default':
        case 'warning':
          return theme.colors.infoPrimary;
      }
    }};
    
    i {
      font-size: 32px;
    }
  }

  .notification-manager__content {
    margin-top: 4px;
  }

  .notification-manager__main {
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    border-left: none;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    padding: 12px 16px;
    border-radius: 0 16px 16px 0;
  }

  .notification-manager__text {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .notification-manager__close {
    cursor: pointer;
    padding: 0;
    border: none;
    border-radius: 4px;
    display: flex;
    height: max-content;
    margin-top: 4px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.iconAdditional};
    transition: all 100ms ease-out;

    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.colors.iconPrimary};
      transform: scale(1.1);
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primaryLight};
    }
  }
`;
