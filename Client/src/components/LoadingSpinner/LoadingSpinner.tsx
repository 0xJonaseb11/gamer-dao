
import { Spinner } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const LoadingSpinnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  height: 50vh;
`;

function LoadingSpinner ({ size = 48 }: { size?: number }) {
  return (
    <LoadingSpinnerWrapper>
      <Spinner size={size} />
    </LoadingSpinnerWrapper>
  );
}

export default LoadingSpinner;
