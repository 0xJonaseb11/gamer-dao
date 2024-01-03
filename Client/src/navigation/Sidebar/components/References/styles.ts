import styled from 'styled-components';

export const ReferencesContainer = styled.div`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  padding-top: 24px;

  .reference-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
    outline: none;

    &:hover .reference-link-text {
      text-decoration: underline;
    }

    &:focus-visible {
      border: 1px solid ${({ theme }) => theme.colors.primaryLight};
    }
  }

  .reference-link-icon {
    font-size: 12px;
  }
`;
