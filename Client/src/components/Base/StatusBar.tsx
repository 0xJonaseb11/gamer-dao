import { ReactNode } from 'react';

import styled from 'styled-components';

export type StatusType = 'success' | 'warning' | 'danger' | 'info';

interface Props {
  status: StatusType;
  children: ReactNode;
}

export const StatusBarWrapper = styled.span<{ status: StatusType }>`
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    display: inline-block;
    content: '';
    border-radius: 50%;
    height: 8px;
    width: 8px;
    margin-right: 4px;
    background-color: ${({ status, theme }) => {
    switch (status) {
      case 'success':
        return theme.colors.successMain;
      case 'warning':
        return theme.colors.warningPrimary;
      case 'danger':
        return theme.colors.errorMain;
      case 'info':
        return theme.colors.infoPrimary;
    }
  }};
  }
`;

const StatusBar = ({ status, children }: Props) => {
  return (
    <StatusBarWrapper status={status}>
      {children}
    </StatusBarWrapper>
  );
};

export default StatusBar;
