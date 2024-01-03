import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DAO_RESERVED_NAME } from '@q-dev/gdk-sdk';
import { ErrorHandler } from 'helpers';
import { ParameterValue } from 'typings/parameters';

import ParametersBlock from './ParametersBlock';

import { getParameters } from 'contracts/helpers/parameters-helper';

interface Props {
  panel: string;
}

function DaoPanelParameters ({ panel }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isRegularParams, setIsRegularParams] = useState(true);
  const [error, setError] = useState('');
  const [parameters, setParameters] = useState<ParameterValue[]>([]);

  useEffect(() => {
    loadParameters();
  }, [isRegularParams]);

  async function loadParameters () {
    try {
      setLoading(true);
      const parameters = await getParameters(panel, isRegularParams ? 'regular' : 'configuration');
      setParameters(parameters);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      setError(t('PANEL_PARAMETERS_LOADING_ERROR', { panel }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ParametersBlock
      title={t('PANEL_PARAMETERS', { panel })}
      parameters={parameters}
      loading={loading}
      errorMsg={error}
      isSwitcherShown={panel !== DAO_RESERVED_NAME}
      switcherValue={isRegularParams}
      switcherLabel={t('SHOW_REGULAR_PARAMS')}
      onChange={() => setIsRegularParams(!isRegularParams)}
    />
  );
}

export default DaoPanelParameters;
