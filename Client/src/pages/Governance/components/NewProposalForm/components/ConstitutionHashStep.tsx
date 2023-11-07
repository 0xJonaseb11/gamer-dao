import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import styled from 'styled-components';
import { NewProposalForm } from 'typings/forms';

import ConstitutionHashByFileField from 'components/ConstitutionHashByFileField';
import Input from 'components/Input';
import { FormStep } from 'components/MultiStepForm';
import Textarea from 'components/Textarea';

import { useNewProposalForm } from '../NewProposalForm';

import { useConstitution } from 'store/constitution/hooks';

import { ZERO_HASH } from 'constants/boundaries';
import { MAX_FIELD_LENGTH } from 'constants/fields';
import { hash, required } from 'utils/validators';

const ConstitutionHashStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;


  .constitution-hash-step__tooltip {
    display: flex;
    margin-bottom: 12px;
  }
  .constitution-hash-step__upload-btn {
    margin: -4px -4px -4px 0;
    padding: 0 4px;
    height: 28px;
    white-space: nowrap;
  }
`;

function ConstitutionHashStep () {
  const { t } = useTranslation();
  const { goNext, goBack } = useNewProposalForm();
  const { constitutionHash } = useConstitution();

  const form = useForm({
    initialValues: {
      hash: !constitutionHash || constitutionHash === ZERO_HASH
        ? ZERO_HASH
        : '',
      remark: ''
    },
    validators: {
      hash: [required, hash],
      remark: [required],
    },
    onSubmit: (form) => {
      goNext(form as NewProposalForm);
    },
  });

  return (
    <FormStep
      disabled={!form.isValid}
      onNext={form.submit}
      onBack={goBack}
    >
      <ConstitutionHashStepContainer>

        <Input
          {...form.fields.hash}
          placeholder={t('HASH')}
          label={t('NEW_CONSTITUTION_HASH')}
          labelTooltip={t('NEW_CONSTITUTION_HASH_TOOLTIP')}
        >
          <ConstitutionHashByFileField
            className="constitution-hash-step__upload-btn"
            onChange={form.fields.hash.onChange}
          />
        </Input>

        <Textarea
          {...form.fields.remark}
          label={t('DESCRIPTION')}
          labelTooltip={t('PROPOSAL_DESCRIPTION_TOOLTIP')}
          placeholder={t('DESCRIPTION')}
          maxLength={MAX_FIELD_LENGTH.proposalRemark}
        />
      </ConstitutionHashStepContainer>
    </FormStep>
  );
}

export default ConstitutionHashStep;
