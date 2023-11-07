import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorHandler } from 'helpers';
import { ParameterValue } from 'typings/parameters';

import ParametersBlock from './ParametersBlock';

import { getRegistryContracts } from 'contracts/helpers/parameters-helper';

function DaoContractRegistry () {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contracts, setContracts] = useState<ParameterValue[]>([]);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts () {
    try {
      setLoading(true);
      const contracts = await getRegistryContracts();
      setContracts(contracts);
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
      setError(t('DAO_CONTRACT_REGISTRY_LOADING_ERROR'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ParametersBlock
      title={t('DAO_CONTRACT_REGISTRY')}
      parameters={contracts}
      loading={loading}
      errorMsg={error}
    />
  );
}

export default DaoContractRegistry;
