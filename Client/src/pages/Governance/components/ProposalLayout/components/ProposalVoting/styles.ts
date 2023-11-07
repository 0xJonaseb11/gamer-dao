import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const StyledProposalVoting = styled.div`
  max-width: 50%;

  ${media.lessThan('large')} {
    max-width: 100%;
  }

  .proposal-voting__progress {
    margin-top: 8px;
  }

  .proposal-voting__votes {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  .proposal-voting__vote {
    display: grid;
    grid-template-columns: auto 1fr 2fr 3fr;
    gap: 8px;

    ${media.lessThan('medium')} {
      grid-template-columns: auto 2fr 1fr 2fr;
    }
  }

  .proposal-voting__vote-bg {
    width: 8px;
    border-radius: 8px;
  }

  .proposal-voting__vote-val {
    text-align: right;
  }
`;
