import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getDecodeData } from '@q-dev/gdk-sdk';
import startCase from 'lodash/startCase';
import styled, { css } from 'styled-components';

interface Props {
  callData: string;
  index: number;
  block?: boolean;
}

export const DAORegistryCallDataViewerContainer = styled.div<{ $block: boolean }>`
  display: grid;
  gap: 16px;
  padding: 16px 16px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};

  ${({ $block }) => $block && css`
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    border-radius: 8px;
  `}
`;

function DAORegistryCallDataViewer ({
  callData,
  index,
  block = false,
}: Props) {
  const { t } = useTranslation();

  const decodedCallData = useMemo(() => {
    try {
      if (!callData) return null;

      const data = getDecodeData('DAORegistry', callData);

      if (!data) return null;

      return {
        functionLabel: t('UPGRADE_TYPE'),
        functionHumanizeName: startCase(data?.functionName),
        args: Object.entries(data.arguments).map(([key, value]) => ({
          label: startCase(key),
          value: String(value)
        }))
      };
    } catch (e) {
      return null;
    }
  }, [callData]);

  const isValidCallData = Boolean(decodedCallData);

  return (
    <DAORegistryCallDataViewerContainer $block={block}>
      <p className={'text-lg font-semibold'}>
        {t('UPGRADE_INDEX', { index: index + 1 })}
      </p>

      {isValidCallData && (
        <>
          <div>
            <p className="text-md color-secondary">{decodedCallData?.functionLabel}</p>
            <p className="text-lg break-word">
              {decodedCallData?.functionHumanizeName}
            </p>
          </div>

          {decodedCallData?.args.map(({ label, value }, index) => (
            <div key={index}>
              <p className="text-md color-secondary">{label}</p>
              <p className="text-lg break-word">
                {value}
              </p>
            </div>
          ))}
        </>
      )}
      <div>
        <p className="text-md color-secondary">
          {isValidCallData ? t('CALL_DATA') : t('INVALID_CALL_DATA')}
        </p>
        <p className="text-sm break-word">
          {callData}
        </p>
      </div>
    </DAORegistryCallDataViewerContainer>
  );
}

export default DAORegistryCallDataViewer;
