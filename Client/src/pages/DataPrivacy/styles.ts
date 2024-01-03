import styled from 'styled-components';

import PageLayout from 'components/PageLayout';

export const PolicyContainer = styled(PageLayout)`
  max-width: 768px;
  margin: 0 auto;

  .privacy-content {
    display: grid;
    gap: 24px;
  }

  .privacy-block {
    display: grid;
    gap: 8px;
  }

  .privacy-list {
    margin-left: 32px;
  }
`;
