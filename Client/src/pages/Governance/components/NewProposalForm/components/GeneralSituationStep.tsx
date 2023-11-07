import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { RadioGroup, RadioOptions } from '@q-dev/q-ui-kit';
import { GeneralSituationType, NewProposalForm } from 'typings/forms';

import { FormStep } from 'components/MultiStepForm';
import Textarea from 'components/Textarea';

import { useNewProposalForm } from '../NewProposalForm';

import { MAX_FIELD_LENGTH } from 'constants/fields';
import { required } from 'utils/validators';

function GeneralSituationStep () {
  const { t } = useTranslation();
  const { goNext, goBack } = useNewProposalForm();

  const form = useForm({
    initialValues: {
      generalSituationType: 'raise-topic' as GeneralSituationType,
      remark: '',
    },
    validators: {
      generalSituationType: [required],
      remark: [required],
    },
    onSubmit: (form) => {
      goNext(form as NewProposalForm);
    },
  });

  const panelTypeOptions: RadioOptions<GeneralSituationType> = [
    {
      value: 'raise-topic',
      label: t('RAISE_SOME_TOPIC')
    },
  ];

  return (
    <FormStep
      disabled={!form.isValid}
      onNext={form.submit}
      onBack={goBack}
    >
      <RadioGroup
        {...form.fields.generalSituationType}
        name="param-panel-type"
        options={panelTypeOptions}
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

export default GeneralSituationStep;
