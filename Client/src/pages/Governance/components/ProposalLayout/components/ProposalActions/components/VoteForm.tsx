
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { RadioGroup } from '@q-dev/q-ui-kit';
import { formatAsset } from '@q-dev/utils';
import { ProposalBaseInfo } from 'typings/proposals';

import Button from 'components/Button';

import { useDaoProposals } from 'hooks/useDaoProposals';

import { StyledVoteForm } from './styles';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useDaoVault } from 'store/dao-vault/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { required } from 'utils/validators';

interface Props {
  proposal: ProposalBaseInfo;
  onSubmit: () => void;
}

function VoteForm ({ proposal, onSubmit }: Props) {
  const { t } = useTranslation();
  const { submitTransaction } = useTransaction();
  const { voteForProposal } = useDaoProposals();
  const { vaultBalance } = useDaoVault();
  const { tokenInfo } = useDaoTokenStore();

  const form = useForm({
    initialValues: { vote: '' },
    validators: { vote: [required] },
    onSubmit: (form) => {
      submitTransaction({
        successMessage: t('VOTE_TX'),
        onConfirm: () => onSubmit(),
        submitFn: () => voteForProposal({
          type: 'vote',
          isVotedFor: form.vote === 'yes',
          proposal,
        })
      });
    }
  });

  return (
    <StyledVoteForm
      noValidate
      $selectedOption={form.values.vote === 'yes' ? 'for' : 'against'}
      onSubmit={form.submit}
    >
      <div>
        <p className="text-md">{t('TOTAL_VOTING_WEIGHT')}</p>
        <p className="text-xl font-semibold">
          {formatAsset(vaultBalance, tokenInfo?.symbol)}
        </p>
      </div>
      <RadioGroup
        {...form.fields.vote}
        extended
        name="vote"
        options={[
          { label: t('YES'), value: 'yes' },
          { label: t('NO'), value: 'no' },
        ]}
      />

      <Button
        type="submit"
        style={{ width: '100%' }}
        disabled={!form.isValid}
      >
        {t('SUBMIT')}
      </Button>
    </StyledVoteForm>
  );
}

export default VoteForm;
