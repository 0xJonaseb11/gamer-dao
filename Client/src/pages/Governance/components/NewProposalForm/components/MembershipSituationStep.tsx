import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { RadioGroup, RadioOptions } from '@q-dev/q-ui-kit';
import { MembershipSituationType } from 'typings/forms';

import Input from 'components/Input';
import { FormStep } from 'components/MultiStepForm';
import Textarea from 'components/Textarea';

import { useNewProposalForm } from '../NewProposalForm';

import { useExpertPanels } from 'store/expert-panels/hooks';

import { MAX_FIELD_LENGTH } from 'constants/fields';
import { address, addressInGroup, addressOutGroup, required } from 'utils/validators';

function MembershipSituationStep ({ panelName }: { panelName: string }) {
  const { t } = useTranslation();
  const { goNext, goBack } = useNewProposalForm();
  const { getPanelMembers } = useExpertPanels();
  const [isLoading, setIsLoading] = useState(true);
  const [membershipAction, setMembershipAction] = useState<MembershipSituationType>('add-member');
  const [panelMembers, setPanelMembers] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      candidateAddress: '',
      remark: '',
    },
    validators: {
      remark: [required],
      candidateAddress: [
        required,
        address,
        membershipAction === 'add-member' ? addressInGroup(panelMembers) : addressOutGroup(panelMembers)]
    },
    onSubmit: (form) => goNext({ ...form, membershipSituationType: membershipAction }),
  });

  useEffect(() => {
    loadPanelMembers();
  }, [panelName]);

  useEffect(() => {
    // HACK: for change validators params
    if (form.values.candidateAddress) { form.reset(); }
  }, [membershipAction]);

  async function loadPanelMembers () {
    setIsLoading(true);
    const members = await getPanelMembers(panelName);
    setPanelMembers(members);
    setIsLoading(false);
  }

  const panelTypeOptions: RadioOptions<MembershipSituationType> = [
    {
      value: 'add-member',
      label: t('ADD_NEW_MEMBER')
    },
    {
      value: 'remove-member',
      label: t('REMOVE_MEMBER'),
    }
  ];

  return (
    <FormStep
      disabled={!form.isValid || isLoading}
      onNext={form.submit}
      onBack={goBack}
    >
      <RadioGroup
        value={membershipAction}
        name="param-panel-type"
        options={panelTypeOptions}
        onChange={setMembershipAction}
      />
      <Input
        {...form.fields.candidateAddress}
        label={t('CANDIDATE_ADDRESS')}
        placeholder={t('ADDRESS_PLACEHOLDER')}
      />
      <Textarea
        {...form.fields.remark}
        label={t('DESCRIPTION')}
        labelTooltip={t('PROPOSAL_DESCRIPTION_TOOLTIP')}
        placeholder={t('DESCRIPTION')}
        maxLength={MAX_FIELD_LENGTH.proposalRemark}
      />
    </FormStep>
  );
}

export default MembershipSituationStep;
