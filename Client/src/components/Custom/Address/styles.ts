import styled from 'styled-components';

export const AddressWrapper = styled.div<{ $semibold: boolean }>`
  display: flex;
  align-items: center;
  
  p {
    margin-bottom: 0;
    font-weight: ${(p) => p.$semibold ? '600' : 'normal'};
  }
`;
