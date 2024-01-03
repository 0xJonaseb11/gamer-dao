import styled, { css } from 'styled-components';

export const StyledFormBlock = styled.div<{ $disabled: boolean }>`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $disabled }) => $disabled
    ? theme.colors.disableSecondary
    : theme.colors.borderSecondary
  }; 

  .form-block__edit-btn {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .form-block__content {
    margin-top: 16px;
    display: grid;
    gap: 12px;
    grid-template-columns: minmax(0, 1fr);
  }

  ${({ theme, $disabled }) => $disabled && css`
    .form-block__title {
      color: ${theme.colors.disableSecondary};
    }
  `};
`;
