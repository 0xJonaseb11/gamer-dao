import styled from 'styled-components';

export const VersionsContainer = styled.div`
  display: grid;
  gap: 8px;

  .version-group {
    border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
    padding-top: 8px;
  }

  .version-group-items {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
`;
