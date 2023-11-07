import styled from 'styled-components';

export const SettingsMenuContainer = styled.div`
  padding-bottom: 8px;

  .language-block,
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 32px;
  }

  .language-block {
    cursor: pointer;
    padding: 16px 32px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }

  .language-pick {
    display: flex;
    gap: 8px;
  }

  .language-pick__flag {
    width: 24px;
    border-radius: 4px;
  }
`;
