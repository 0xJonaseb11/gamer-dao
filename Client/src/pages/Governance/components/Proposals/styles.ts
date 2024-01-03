import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  ${media.lessThan('medium')} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ListEmptyStub = styled.div`
  margin: 32px auto;
  text-align: center;
`;

export const ListNextContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
