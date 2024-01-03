import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const StatsContainer = styled.div`
  margin-bottom: 16px;

  .stats-list {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    ${media.lessThan('medium')} {
      grid-template-columns: 1fr;
    }
  }

  .stats-item {
    display: grid;
    gap: 4px;
    align-content: start;
    padding: 24px;

    ${media.lessThan('medium')} {
      padding: 8px 0;
    }

    &:not(:first-child) {
      ${media.greaterThan('medium')} {
        border-left: 1px solid ${({ theme }) => theme.colors.borderSecondary};
      }
    }
  }

  .stats-item-lbl {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .stats-item-val {
    display: grid;
  }

  .stats-item-val--groups {
    overflow-wrap: anywhere;
  }
`;
