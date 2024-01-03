import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Select } from '@q-dev/q-ui-kit';

interface Props {
  nftsList: string[];
  hint?: string;
  value: string;
  error: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function Erc721IdField ({ nftsList, ...rest }: Props) {
  const { t } = useTranslation();

  const Component = useMemo(() => {
    return nftsList.length > 0 ? Select : Input;
  }, [nftsList.length]);

  return (
    <Component
      {...rest}
      label={t('NFT_ID')}
      options={nftsList.map((value) => ({ value, label: value }))}
      placeholder={t('NFT_ID')}
    />
  );
}

export default Erc721IdField;
