import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const ProposalLayoutContainer = styled.div`
  display: grid;
  gap: 32px;

  ${media.lessThan('medium')} {
    gap: 24px;
  }

  .proposal-layout__voting {
    display: flex;
    gap: 24px;

    ${media.lessThan('large')} {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    
    ${media.lessThan('medium')} {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .details-list {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;

    ${media.lessThan('medium')} {
      grid-template-columns: minmax(0, 1fr);
    }

    &.single-column {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .details-list-item {
    display: grid;
    gap: 16px;
  }

  .details-item {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 16px;

    ${media.lessThan('medium')} {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
    }
  }

  .details-stub {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    text-align: center;

    .details-stub-content {
      display: grid;
      gap: 4px;
    }
  }
`;
