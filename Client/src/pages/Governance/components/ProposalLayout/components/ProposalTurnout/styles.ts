import styled from 'styled-components';

export const StyledProposalTurnout = styled.div`
  .proposal-turnout__quorum {
    display: flex;
    justify-content: space-between;
  }

  .proposal-turnout__progress {
    margin-top: 8px;
  }

  .proposal-turnout__votes {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  .proposal-turnout__vote {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .proposal-turnout__votes-val {
    text-align: right;
  }
`;
