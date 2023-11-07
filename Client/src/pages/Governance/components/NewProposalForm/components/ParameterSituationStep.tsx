import { useTranslation } from 'react-i18next';

import { useForm, useFormArray } from '@q-dev/form-hooks';
import { Icon } from '@q-dev/q-ui-kit';
import { FormParameter, NewProposalForm, ParameterSituationType } from 'typings/forms';

import Button from 'components/Button';
import FormBlock from 'components/FormBlock';
import { FormStep } from 'components/MultiStepForm';
import ParameterForm from 'components/ParameterForm';
import Textarea from 'components/Textarea';

import { useNewProposalForm } from '../NewProposalForm';

import { MAX_FIELD_LENGTH } from 'constants/fields';
import { required } from 'utils/validators';

interface Props {
  panelName: string;
  situation?: ParameterSituationType;
}

function ParameterSituation ({ panelName, situation }: Props) {
  const { t } = useTranslation();
  const { goNext, goBack, onChange } = useNewProposalForm();

  const form = useForm({
    initialValues: {
      remark: '',
    },
    validators: {
      remark: [required],
    },
    onSubmit: (form) => {
      goNext(form as NewProposalForm);
    },
  });

  const formArray = useFormArray<FormParameter>({
    minCount: 1,
    maxCount: 10,
    onSubmit: (forms) => {
      onChange({ params: forms });
    },
  });

  const handleSubmit = () => {
    if (!form.validate() || !formArray.validate()) return;
    formArray.submit();
    form.submit();
  };

  return (
    <FormStep
      disabled={!form.isValid || !formArray.isValid}
      onNext={handleSubmit}
      onBack={goBack}
    >
      <Textarea
        {...form.fields.remark}
        label={t('DESCRIPTION')}
        labelTooltip={t('PROPOSAL_DESCRIPTION_TOOLTIP')}
        placeholder={t('DESCRIPTION')}
        maxLength={MAX_FIELD_LENGTH.proposalRemark}
      />

      {formArray.forms.map((form, i) => (
        <FormBlock
          key={form.id}
          title={t('PARAMETER_INDEX', { index: i + 1 })}
          icon={formArray.forms.length > 1 ? 'delete' : undefined}
          onAction={() => formArray.removeForm(form.id)}
        >
          <ParameterForm
            key={form.id}
            situation={situation}
            panelName={panelName}
            onChange={form.onChange}
          />
        </FormBlock>
      ))}

      <Button
        look="ghost"
        onClick={formArray.appendForm}
      >
        <Icon name="add" />
        <span>{t('ADD_PARAMETER')}</span>
      </Button>
    </FormStep>
  );
}

export default ParameterSituation;
