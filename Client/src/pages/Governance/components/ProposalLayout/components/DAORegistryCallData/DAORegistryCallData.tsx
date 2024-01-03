import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getDecodeData } from '@q-dev/gdk-sdk';

import DAORegistryCallDataViewer from 'components/DAORegistryCallDataViewer';

interface Props {
  callData: string;
}

function DAORegistryCallData ({ callData }: Props) {
  const { t } = useTranslation();

  const decodedMulticallArgs = useMemo(() => {
    try {
      if (!callData) return [];

      const data = getDecodeData('DAORegistry', callData);

      return data?.functionName === 'multicall' && Array.isArray(data?.arguments?.data)
        ? data.arguments.data as string[]
        : [];
    } catch (e) {
      return [];
    }
  }, [callData]);

  if (!decodedMulticallArgs.length) return null;

  return (
    <div className="block">
      <h2 className="text-h2">{t('UPGRADES')}</h2>

      <div className="block__content">
        <div className="details-list">
          {decodedMulticallArgs.map((callData, i) => (
            <DAORegistryCallDataViewer
              key={i}
              block
              callData={callData}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DAORegistryCallData;
