import { NavLink } from 'react-router-dom';

import styled from 'styled-components';

export const StyledLink = styled(NavLink)`
  width: 238px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  outline: none;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover,
  &:focus-visible {
    text-decoration: none;
    background-color: ${({ theme }) => theme.colors.tertiaryLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &.active,
  &.active:hover,
  &.active:focus-visible {
    font-weight: 600;
    background-color: ${({ theme }) => theme.colors.tertiaryMain};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .sidebar-link-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-link-count {
    display: grid;
    place-content: center;
    align-items: flex-end;
    padding: 0 4px;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.primaryMain};
    color: ${({ theme }) => theme.colors.buttonTextPrimary};
  }
`;
