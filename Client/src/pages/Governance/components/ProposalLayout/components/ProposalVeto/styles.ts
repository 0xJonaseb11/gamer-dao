import styled from 'styled-components';

export const StyledProposalVeto = styled.div`
  .proposal-veto__progress {
    margin-top: 8px;
  }

  .proposal-veto__votes {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  .proposal-veto__vote {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 8px;
  }

  .proposal-veto__vote-val {
    text-align: right;
  }

  .proposal-veto__stub {
    display: flex;
    align-items: center;
    height: 100%;
    text-align: center;
  }
`;
