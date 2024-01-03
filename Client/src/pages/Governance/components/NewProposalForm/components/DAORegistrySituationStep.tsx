import { useRef } from 'react';
import { useTranslation, } from 'react-i18next';

import { useFormArray } from '@q-dev/form-hooks';
import { Icon } from '@q-dev/q-ui-kit';
import { FormDAORegistry, FormValidatesMap } from 'typings/forms';

import Button from 'components/Button';
import FormBlock from 'components/FormBlock';
import { FormStep } from 'components/MultiStepForm';

import { useNewProposalForm } from '../NewProposalForm';

import DAORegistryForm from './DAORegistryForm';

const MAX_UPGRADES_COUNT = 10;

function DAORegistrySituationStep () {
  const { t } = useTranslation();
  const { goNext, goBack } = useNewProposalForm();
  const formValidatesMap = useRef<FormValidatesMap>({});

  const formArray = useFormArray<FormDAORegistry>({
    minCount: 1,
    maxCount: MAX_UPGRADES_COUNT,
    onSubmit: (forms) => {
      goNext({ callData: forms.map(i => i.callData) });
    },
  });

  const handleSubmit = () => {
    const isChildFieldsValid = Object.values(formValidatesMap.current)
      .map(validate => validate())
      .every(i => i);
    if (!isChildFieldsValid || !formArray.validate()) return;
    formArray.submit();
  };

  return (
    <FormStep
      onNext={handleSubmit}
      onBack={goBack}
    >

      {formArray.forms.map((form, i) => (
        <FormBlock
          key={form.id}
          title={t('UPGRADE_INDEX', { index: i + 1 })}
          icon={formArray.forms.length > 1 ? 'delete' : undefined}
          onAction={() => formArray.removeForm(form.id)}
        >
          <DAORegistryForm
            key={form.id}
            abiName="DAORegistry"
            formValidatesMap={formValidatesMap}
            formId={form.id}
            onChange={form.onChange}
          />
        </FormBlock>
      ))}

      {formArray.forms.length < MAX_UPGRADES_COUNT && (
        <Button
          look="ghost"
          onClick={formArray.appendForm}
        >
          <Icon name="add" />
          <span>{t('ADD_UPGRADE')}</span>
        </Button>
      )}
    </FormStep>
  );
}

export default DAORegistrySituationStep;
