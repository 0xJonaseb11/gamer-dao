import styled from 'styled-components';

export const TabsContainer = styled.nav`
  position: relative;
  display: flex;
  min-width: 100%;
  width: 100%;
  overflow-x: auto;
  padding: 8px;
  margin: -8px;
  margin-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    display: block;
    z-index: -1;
    left: 0;
    bottom: 7px;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.borderAdditional};
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .tab {
    position: relative;
    padding: 8px 16px;
    white-space: nowrap;
    cursor: pointer;

    .tab-label {
      color: ${({ theme }) => theme.colors.textPrimary};
    }

    &.active {
      .tab-label {
        color: ${({ theme }) => theme.colors.textActive};
      }
    }

    .tab-active,
    .tab-label::after {
      content: '';
      bottom: -1px;
      right: 0;
      position: absolute;
      width: 100%;
      height: 1px;
    }

    .tab-active {
      background-color: ${({ theme }) => theme.colors.textActive};
    }

    &:hover .tab-label::after {
      background-color: ${({ theme }) => theme.colors.borderTertiary};
    }

    &:focus-visible {
      outline: none;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 1px;
        z-index: 1;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
      }
    }
  }

  .tab-count {
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 2;
    display: grid;
    place-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    background-color:  ${({ theme }) => theme.colors.primaryMain};
    color: ${({ theme }) => theme.colors.buttonTextPrimary};
  }
`;
