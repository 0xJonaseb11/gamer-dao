import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const PageLayoutContainer = styled.div`
  .page-layout__title-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 16px;

    ${media.lessThan('medium')} {
      flex-direction: column;
      gap: 16px;
    }
  }

  .page-layout__title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    ${media.lessThan('medium')} {
      gap: 8px;
    }

    // TODO: Remove when page header is passed via props
    .page-layout__title-text + .q-ui-tooltip {
      margin-left: -16px;

      ${media.lessThan('medium')} {
        margin-left: -8px;
      }
    }
  }

  .page-layout__title-actions {
    display: flex;
    align-items: center;
  }

  .page-layout__content {
    margin-top: 32px;
    max-width: 100%;
    display: grid;
    grid-template-columns: minmax(100px, 1fr);
    gap: 16px;

    ${media.lessThan('medium')} {
      margin-top: 24px;
    }

    .content__colm-2 {
      display: grid;
      grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr);
      gap: 16px;
    }

    .content__time-locks {
      & > div {
        height: 97%;
      }
    }

    .content__colm-3 {
      display: flex;
      grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr);
      gap: 16px;

      ${media.lessThan('medium')} {
        flex-direction: column;
      }
    }

    ${media.lessThan('large')} {
      .content__colm-2 {
        grid-template-columns: minmax(100px, 1fr);
      }
    }
  }

  .page-layout__top-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
    opacity: 0.5;
    transition: all 300ms ease-out;

    ${media.lessThan('medium')} {
      display: none;
    }

    &:hover {
      opacity: 1;
    }
  }
`;
