import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { media } from '@q-dev/q-ui-kit';
import { formatAsset } from '@q-dev/utils';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';

import { useSignConstitution } from 'hooks';
import useApproveToken from 'hooks/useApproveToken';
import useProposalActionsInfo from 'hooks/useProposalActionsInfo';

import Erc721IdField from './Erc721IdField';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { getDAOVaultDepositAmount } from 'contracts/helpers/dao-vault-helper';

import { amount, required } from 'utils/validators';

const StyledForm = styled.form`
  .transfer-form-main {
    margin-top: 16px;
    display: grid;
    gap: 16px;
  }

  .transfer-form-action {
    margin-top: 8px;

    ${media.lessThan('medium')} {
      width: 100%;
    }
  }
`;

function DepositForm () {
  const { t } = useTranslation();
  const {
    walletBalance,
    depositToVault,
    loadAllBalances,
    walletNftsList,
    chainBalance,
    vaultBalance,
  } = useDaoVault();
  const { isConstitutionSignNeeded, signConstitution, loadConstitutionData } = useSignConstitution();
  const { submitTransaction } = useTransaction();
  const { tokenInfo, getToken } = useDaoTokenStore();
  const { checkIsApprovalNeeded, approveSpendToken } = useApproveToken();
  const { checkIsUserTokenHolder } = useProposalActionsInfo();

  const [maxAmount, setMaxAmount] = useState('0');
  const [canDeposit, setCanDeposit] = useState(false);

  const form = useForm({
    initialValues: {
      amount: '',
      id: ''
    },
    validators: {
      amount: tokenInfo?.type === 'erc5484' || tokenInfo?.type === 'erc721' ? [] : [required, amount(maxAmount)],
      id: tokenInfo?.type === 'erc721' ? [required] : []
    },
    onSubmit: ({ amount, id }) => {
      isDepositApprovalNeeded
        ? approveSpendToken()
        : submitTransaction({
          successMessage: t('DEPOSIT_INTO_VAULT_TX'),
          submitFn: () => depositToVault({ amount, erc721Id: id }),
          onSuccess: async () => {
            form.reset();
            await Promise.all([
              loadAllBalances(),
              getToken(),
            ]);
          },
        });
    }
  });

  const updateMaxAmount = async () => {
    const depositAmount = tokenInfo
      ? getDAOVaultDepositAmount(form.values.amount, walletBalance, chainBalance, tokenInfo)
      : { canDeposit: false, balance: '0' };
    if (tokenInfo?.type === 'erc5484') {
      const isUserTokenHolder = await checkIsUserTokenHolder();
      setCanDeposit(depositAmount.canDeposit && !isUserTokenHolder);
      return;
    }
    setCanDeposit(depositAmount.canDeposit);
    setMaxAmount(depositAmount.balance);
  };

  useEffect(() => {
    loadConstitutionData();
  }, []);

  useEffect(() => {
    updateMaxAmount();
  }, [form.values.amount, tokenInfo, walletBalance]);

  const isDepositApprovalNeeded = useMemo(() => {
    return checkIsApprovalNeeded(form.values.amount);
  }, [form.values.amount, tokenInfo]);

  const submitBtnText = useMemo(() => {
    if (isConstitutionSignNeeded) {
      return t('SIGN_CONSTITUTION_TO_DEPOSIT');
    }

    return isDepositApprovalNeeded
      ? t('APPROVE')
      : t('DEPOSIT');
  }, [t, isDepositApprovalNeeded, isConstitutionSignNeeded]);

  const isDepositedNft = useMemo(() => Number(vaultBalance) > 0 && tokenInfo?.type === 'erc721', [vaultBalance, tokenInfo]);

  return (
    <StyledForm
      noValidate
      className="block"
    >
      <h2 className="text-h2">{t('DEPOSIT')}</h2>
      <p className="text-md color-secondary">{t('FROM_WALLET_TO_VAULT')}</p>

      <div className="transfer-form-main">
        {tokenInfo?.type === 'erc721' && (
          <Erc721IdField
            {...form.fields.id}
            nftsList={walletNftsList}
            disabled={isDepositedNft}
            hint={isDepositedNft ? t('MULTIPLE_NFT_DEPOSIT_WARNING') : t('AVAILABLE_TO_DEPOSIT', { amount: formatAsset(maxAmount, tokenInfo.symbol) })}
          />
        )}
        {(tokenInfo?.type === 'erc20' || tokenInfo?.type === 'native') &&
          <Input
            {...form.fields.amount}
            type="number"
            label={t('AMOUNT')}
            prefix={tokenInfo?.symbol}
            hint={+maxAmount && form.values.amount === maxAmount && !canDeposit
              ? t('WARNING_NO_Q_LEFT')
              : t('AVAILABLE_TO_DEPOSIT', { amount: formatAsset(maxAmount, tokenInfo?.symbol) })
            }
            max={maxAmount}
            placeholder="0.0"
          />}

        <Button
          className="transfer-form-action"
          disabled={!isConstitutionSignNeeded && (!form.isValid || !canDeposit || isDepositedNft)}
          onClick={isConstitutionSignNeeded ? signConstitution : form.submit }
        >
          {submitBtnText}
        </Button>
      </div>
    </StyledForm>
  );
}

export default DepositForm;
