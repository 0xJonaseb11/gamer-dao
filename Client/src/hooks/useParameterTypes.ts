import { useTranslation } from 'react-i18next';

import { ParameterType } from '@q-dev/gdk-sdk';

function useParameterTypes () {
  const { t } = useTranslation();
  const parameterTypeMap: Record<ParameterType, string> = {
    [ParameterType.NONE]: t('NONE'),
    [ParameterType.ADDRESS]: t('ADDRESS'),
    [ParameterType.UINT256]: t('UINT'),
    [ParameterType.STRING]: t('STRING'),
    [ParameterType.BYTES]: t('BYTES'),
    [ParameterType.BOOL]: t('BOOLEAN'),
  };

  function translateParameterType (type: ParameterType) {
    return parameterTypeMap[type] || t('UNKNOWN');
  }

  return { translateParameterType };
}

export default useParameterTypes;
