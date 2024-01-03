import styled from 'styled-components';

export const LanguagesContainer = styled.div`
  padding: 4px 0;

  .language-option {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }

  .language-option__main {
    display: flex;
    gap: 8px;
  }

  .language-option__flag {
    width: 24px;
    border-radius: 4px;
  }
`;
