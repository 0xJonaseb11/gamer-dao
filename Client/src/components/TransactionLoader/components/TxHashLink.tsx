import { useTranslation } from 'react-i18next';

import useNetworkConfig from 'hooks/useNetworkConfig';

interface Props {
  hash: string;
}

function TxHashLink ({ hash }:Props) {
  const { t } = useTranslation();
  const { explorerUrl } = useNetworkConfig();

  return (
    <a
      style={{ marginTop: '10px', display: 'block' }}
      href={`${explorerUrl}/tx/${hash}`}
      target="_blank"
      className="text-md font-light color-secondary"
      rel="noreferrer"
      title={t('VIEW_ON_EXPLORER')}
    >
      {t('VIEW_ON_EXPLORER')}
    </a>
  );
}

export default TxHashLink;
