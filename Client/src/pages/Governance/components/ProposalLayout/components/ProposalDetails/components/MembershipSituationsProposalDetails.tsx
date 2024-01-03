import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DecodedData } from '@q-dev/gdk-sdk';

import ExplorerAddress from 'components/Custom/ExplorerAddress';

interface Props {
  decodedCallData: DecodedData;
}

function BaseDetails ({ decodedCallData }: Props) {
  const { t } = useTranslation();

  const functionType = useMemo(() => {
    switch (decodedCallData.functionName) {
      case 'addMember':
        return t('ADD_MEMBER');
      case 'removeMember':
        return t('REMOVE_MEMBER');
      default:
        return '';
    }
  }, [t, decodedCallData]);

  if (!functionType) return null;

  return (
    <>
      <div className="details-list-item">
        <div className="details-item">
          <p className="text-md color-secondary">{t('TYPE')}</p>
          <p className="text-md">{functionType}</p>
        </div>
      </div>

      {Boolean(decodedCallData.arguments?.member_) && (
        <div className="details-list-item">
          <div className="details-item">
            <p className="text-md color-secondary">{t('CANDIDATE')}</p>
            <ExplorerAddress
              iconed
              short
              className="text-md"
              address={decodedCallData.arguments.member_}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default BaseDetails;
