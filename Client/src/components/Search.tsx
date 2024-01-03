import { HTMLAttributes } from 'react';

import { Search as UiSearch } from '@q-dev/q-ui-kit';

import { useProviderStore } from 'store/provider/hooks';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  disabled?: boolean;
  alwaysEnabled?: boolean;
  onChange: (val: string) => void;
}

function Search ({
  value,
  disabled,
  onChange,
  alwaysEnabled,
  ...rest
}: Props) {
  const { currentProvider, isRightNetwork } = useProviderStore();
  const isDisabled = disabled || (!alwaysEnabled && (!currentProvider?.isConnected || !isRightNetwork));

  return (
    <UiSearch
      value={value}
      disabled={isDisabled}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Search;
