import styled, { css } from 'styled-components';

export const ParameterViewerContainer = styled.div<{ $block: boolean }>`
  display: grid;
  gap: 16px;
  padding: 16px 16px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};

  ${({ $block }) => $block && css`
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    border-radius: 8px;
  `}
`;
