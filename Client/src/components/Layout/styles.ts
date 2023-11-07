import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const AppContainer = styled.div<{ $wide: boolean }>`
  display: grid;
  grid-template-columns: ${({ $wide }) => ($wide ? '1fr' : 'auto minmax(0, 1fr)')};

  .app__main {
    position: relative;
    height: calc(100vh - 72px);
    max-height: calc(100vh - 72px);
    overflow-y: auto;
    overflow-y: overlay;
    overflow-x: hidden;
   

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .app__content{
    background-image: url(/src/assets/img/bg.jpg);
    background-size: cover;
  }

  .app__main-content {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
   

    ${media.lessThan('medium')} {
      padding: 16px;
    }
  }
`;
