import styled from 'styled-components';

export const ProgressBarWrapper = styled.span<{ value: number }>`
  display: flex;
  align-items: center;
  &::before {
    display: inline-block;
    content: '';
    border-radius: 0.375rem;
    height: 8px;
    width: 8px;
    margin-right: 4px;
    background-color: ${({ theme, value }) => {
      if (value <= 80) return theme.colors.successMain;
      if (value <= 98) return theme.colors.warningPrimary;
      return theme.colors.errorMain;
    }};
  }
`;
