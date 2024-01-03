import { useTranslation } from 'react-i18next';

import { useFormArray } from '@q-dev/form-hooks';
import { Check, Icon } from '@q-dev/q-ui-kit';
import { FormParameter } from 'typings/forms';

import Button from 'components/Button';
import FormBlock from 'components/FormBlock';
import { FormStep } from 'components/MultiStepForm';
import ParameterForm from 'components/ParameterForm';

import { useNewProposalForm } from '../NewProposalForm';

function ConstitutionSituationStep ({ panelName }: { panelName: string }) {
  const { t } = useTranslation();
  const { values, goNext, goBack, onChange } = useNewProposalForm();

  const formArray = useFormArray<FormParameter>({
    minCount: 1,
    maxCount: 10,
    onSubmit: (forms) => {
      goNext({ params: forms });
    },
  });

  const handleCheckChange = (val: boolean) => {
    onChange({ isParamsChanged: val });
    formArray.reset();
  };

  return (
    <FormStep
      disabled={!formArray.isValid}
      onNext={values.isParamsChanged
        ? formArray.submit
        : () => goNext({ params: [] })
      }
      onBack={goBack}
    >
      <Check
        value={values.isParamsChanged}
        label={t('MAKE_CHANGES_TO_CONSTITUTION_PARAMETERS')}
        style={{ marginBottom: '8px' }}
        onChange={handleCheckChange}
      />

      {formArray.forms.map((form, i) => (
        <FormBlock
          key={form.id}
          title={t('PARAMETER_INDEX', { index: i + 1 })}
          icon={formArray.forms.length > 1 ? 'delete' : undefined}
          disabled={!values.isParamsChanged}
          onAction={() => formArray.removeForm(form.id)}
        >
          <ParameterForm
            key={form.id}
            panelName={panelName}
            disabled={!values.isParamsChanged}
            onChange={form.onChange}
          />
        </FormBlock>
      ))}

      <Button
        look="ghost"
        disabled={!values.isParamsChanged}
        onClick={formArray.appendForm}
      >
        <Icon name="add" />
        <span>{t('ADD_PARAMETER')}</span>
      </Button>
    </FormStep>
  );
}

export default ConstitutionSituationStep;
