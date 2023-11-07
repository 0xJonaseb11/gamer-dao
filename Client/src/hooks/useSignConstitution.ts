import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useConstitution } from 'store/constitution/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';
import { useProviderStore } from 'store/provider/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { ZERO_HASH } from 'constants/boundaries';

export function useSignConstitution () {
  const { t } = useTranslation();

  const { constitutionHash } = useConstitution();
  const { signConstitution, loadConstitutionData, isConstitutionSigned } = useDaoVault();
  const { submitTransaction } = useTransaction();
  const { userAddress } = useProviderStore();

  const isConstitutionSignNeeded = useMemo(() => {
    return Boolean(userAddress) && !isConstitutionSigned && constitutionHash !== ZERO_HASH;
  }, [isConstitutionSigned, constitutionHash]);

  const sendSignConstitution = () => {
    submitTransaction({
      successMessage: t('SIGN_CONSTITUTION_TX'),
      submitFn: signConstitution,
      onSuccess: () => {
        loadConstitutionData();
      },
    });
  };

  return {
    isConstitutionSignNeeded,
    loadConstitutionData,
    signConstitution: sendSignConstitution
  };
}
