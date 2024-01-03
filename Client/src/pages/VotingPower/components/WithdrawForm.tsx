import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { media } from '@q-dev/q-ui-kit';
import { formatAsset } from '@q-dev/utils';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';

import useProposalActionsInfo from 'hooks/useProposalActionsInfo';

import Erc721IdField from './Erc721IdField';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { amount, required } from 'utils/validators';

const StyledForm = styled.form`
  .withdraw-form-main {
    margin-top: 16px;
    display: grid;
    gap: 16px;
  }

  .withdraw-form-action {
    margin-top: 8px;

    ${media.lessThan('medium')} {
      width: 100%;
    }
  }
`;

function WithdrawForm () {
  const { t } = useTranslation();
  const { submitTransaction } = useTransaction();
  const { withdrawFromVault, withdrawalBalance, loadAllBalances, withdrawalNftsList, walletBalance } = useDaoVault();
  const { tokenInfo, getToken } = useDaoTokenStore();
  const { checkIsUserTokenHolder } = useProposalActionsInfo();
  const [isErc5484Approved, setIsErc5484Approved] = useState(true);

  const isNftLike = useMemo(() => tokenInfo?.type === 'erc721' || tokenInfo?.type === 'erc5484', [tokenInfo]);

  const form = useForm({
    initialValues: {
      amount: '',
      id: ''
    },
    validators: {
      amount: isNftLike ? [] : [required, amount(withdrawalBalance)],
      id: tokenInfo?.type === 'erc721' ? [required] : []
    },
    onSubmit: ({ amount, id }) => {
      submitTransaction({
        successMessage: t('WITHDRAW_FROM_VAULT_TX'),
        submitFn: async () => withdrawFromVault(
          { amount, erc721Id: id }
        ),
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

  const checkWithdrawAbility = async () => {
    if (tokenInfo?.type === 'erc5484') {
      const isUserTokenHolder = await checkIsUserTokenHolder();
      setIsErc5484Approved(!!tokenInfo.isAuthorizedBySBT && isUserTokenHolder && !!Number(walletBalance));
    }
  };

  useEffect(() => {
    checkWithdrawAbility();
  }, [tokenInfo, walletBalance]);

  return (
    <StyledForm
      noValidate
      className="block"
    >
      <h2 className="text-h2">{t('WITHDRAW')}</h2>
      <p className="text-md color-secondary">{t('FROM_VAULT_TO_WALLET')}</p>

      <div className="withdraw-form-main">
        {tokenInfo?.type === 'erc721' && (
          <Erc721IdField
            {...form.fields.id}
            nftsList={withdrawalNftsList}
            hint={t('AVAILABLE_TO_WITHDRAW', { amount: withdrawalNftsList.length })}
          />
        )}
        {(tokenInfo?.type === 'erc20' || tokenInfo?.type === 'native') &&
          <Input
            {...form.fields.amount}
            type="number"
            label={t('AMOUNT')}
            prefix={tokenInfo?.symbol}
            max={String(withdrawalBalance)}
            placeholder="0.0"
            hint={t('AVAILABLE_TO_WITHDRAW', { amount: formatAsset(withdrawalBalance, tokenInfo?.symbol) })}
          />
        }
        <Button
          type="submit"
          className="withdraw-form-action"
          disabled={!form.isValid || !isErc5484Approved}
          onClick={form.submit}
        >
          {t('WITHDRAW')}
        </Button>
      </div>
    </StyledForm>
  );
}

export default WithdrawForm;
