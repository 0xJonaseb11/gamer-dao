import { formatNumberFixed } from '@q-dev/utils';

import { ProgressBarWrapper } from './styles';

const ProgressBar = ({ value }: { value: string | number }) => {
  return (
    <ProgressBarWrapper value={Number(value)}>
      {formatNumberFixed(value, 2)} %
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
