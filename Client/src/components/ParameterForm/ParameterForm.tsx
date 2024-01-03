import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, useForm } from '@q-dev/form-hooks';
import { filterParameter, ParameterType } from '@q-dev/gdk-sdk';
import { Select, Tip } from '@q-dev/q-ui-kit';
import { FormParameter, ParameterSituationType } from 'typings/forms';
import { ParameterValue } from 'typings/parameters';

import Input from 'components/Input';

import { ParameterFormContainer } from './styles';

import { getParameters } from 'contracts/helpers/parameters-helper';

import { parameterType, required } from 'utils/validators';

interface Props {
  panelName: string;
  situation?: ParameterSituationType;
  disabled?: boolean;
  onChange: (form: Form<FormParameter>) => void;
}

const EXCLUSIONS_KEY_PART = '.votingTarget';
const CONSTITUTION_HASH_KEY = 'constitution.hash';

function ParameterForm ({
  panelName,
  situation,
  disabled = false,
  onChange
}: Props) {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState('');
  const [keys, setKeys] = useState<ParameterValue[]>([]);

  const form = useForm({
    initialValues: {
      key: '',
      value: '',
      type: ParameterType.ADDRESS,
      isNew: false,
    },
    validators: {
      type: [required],
      key: [required],
      value: [required, parameterType(form => (form as FormParameter).type)],
      isNew: []
    },
  });

  const parameterNamesOptions = useMemo(() => {
    return keys
      .filter(({ name }) => !name.includes(EXCLUSIONS_KEY_PART) && name !== CONSTITUTION_HASH_KEY)
      .map(({ name }) => ({ label: name, value: name }));
  }, [keys]);

  const parameterTypesOptions = useMemo(() => {
    return [
      { value: ParameterType.ADDRESS, label: t('ADDRESS') },
      { value: ParameterType.UINT256, label: t('UINT') },
      { value: ParameterType.STRING, label: t('STRING') },
      { value: ParameterType.BYTES, label: t('BYTES') },
      { value: ParameterType.BOOL, label: t('BOOLEAN') },
    ];
  }, [t]);

  const isParameterKeyWarning = useMemo(() => {
    return !form.values.isNew && (form.values.key as string).includes(EXCLUSIONS_KEY_PART);
  }, [form.values.key, form.values.isNew]);

  useEffect(() => {
    onChange(form);
  }, [form.values, onChange]);

  useEffect(() => {
    form.values.key = '';
    getParameters(panelName, situation)
      .then(setKeys);

    return () => {
      setKeys([]);
    };
  }, [panelName]);

  useEffect(() => {
    const parameter = keys.find(item => item.name === form.values.key);
    if (!parameter) {
      setCurrentValue('');
      form.fields.isNew.onChange(true);
      return;
    }

    const parameters = filterParameter(keys, parameter.solidityType as ParameterType, form.values.key.toString());
    if (!parameters.length) return;
    setCurrentValue(parameters[0].normalValue);
    form.fields.isNew.onChange(false);
    form.fields.type.onChange(parameter.solidityType);

    return () => {
      setCurrentValue('');
    };
  }, [form.values.key, keys]);

  return (
    <ParameterFormContainer>

      <Select
        {...form.fields.key}
        combobox
        label={t('PARAMETER_KEY')}
        placeholder={t('KEY')}
        options={parameterNamesOptions}
        disabled={disabled}
      />

      <Select
        {...form.fields.type}
        label={t('PARAMETER_TYPE')}
        disabled={disabled || !form.values.isNew}
        options={parameterTypesOptions}
      />

      {currentValue && (
        <Tip compact>
          <p className="break-word">
            {`${t('CURRENT_VALUE')}: ${currentValue}`}
          </p>
        </Tip>
      )}

      <Input
        {...form.fields.value}
        label={t('PARAMETER_VALUE')}
        placeholder={t('VALUE')}
        disabled={disabled}
      />

      {isParameterKeyWarning && (
        <Tip compact type="warning">
          <p className="break-word">
            {t('VOTING_TARGET_PARAM_WARNING_TIP')}
          </p>
        </Tip>
      )}
    </ParameterFormContainer>
  );
}

export default ParameterForm;
