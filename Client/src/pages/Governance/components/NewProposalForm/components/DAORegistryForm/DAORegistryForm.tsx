import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, useForm } from '@q-dev/form-hooks';
import { getDecodeData } from '@q-dev/gdk-sdk';
import { Select, Switch } from '@q-dev/q-ui-kit';
import startCase from 'lodash/startCase';
import styled from 'styled-components';
import { FormDAORegistry, FormValidatesMap } from 'typings/forms';

import Textarea from 'components/Textarea';

import DAORegistryArgsForm from './DAORegistryArgsForm';

import { DAO_REGISTRY_AVAILABLE_FUNCTIONS } from 'constants/dao-registry';
import { callData, required } from 'utils/validators';

interface Props {
  formId: string;
  formValidatesMap: MutableRefObject<FormValidatesMap>;
  abiName: string;
  onChange: (form: Form<FormDAORegistry>) => void;
}

export const DAORegistryFormContainer = styled.div`
  display: grid;
  gap: 16px;
`;

function DAORegistryForm ({ onChange, formValidatesMap, formId, abiName }: Props) {
  const { t } = useTranslation();
  const [isRawMode, setIsRawMode] = useState(false);

  const form = useForm({
    initialValues: {
      upgradeName: '',
      callData: '',
    },
    validators: {
      upgradeName: [required],
      callData: [required, callData({
        functionNames: Object.values(DAO_REGISTRY_AVAILABLE_FUNCTIONS),
        abiName: abiName,
      })],
    },
  });

  const upgradeNameOptions = useMemo(() => {
    return Object.values(DAO_REGISTRY_AVAILABLE_FUNCTIONS).map((name) => ({
      label: startCase(name),
      value: name
    }));
  }, []);

  const decodedCallData = useMemo(() => {
    try {
      if (!form.validateByKey('callData', true)) return null;
      const decodedData = getDecodeData(abiName, form.values.callData);

      if (!decodedData) return null;

      return upgradeNameOptions.some(({ value }) => value === decodedData?.functionName)
        ? decodedData
        : null;
    } catch (e) {
      return null;
    }
  }, [form.values.callData, upgradeNameOptions, abiName]);

  useEffect(() => {
    if (isRawMode) {
      if (decodedCallData) {
        form.fields.upgradeName.onChange(decodedCallData?.functionName || '');
      } else if (form.values.upgradeName) {
        form.fields.upgradeName.onChange('');
      }
    }
  }, [form.values.upgradeName, decodedCallData, isRawMode]);

  useEffect(() => {
    onChange(form);
  }, [form.values, onChange]);

  return (
    <DAORegistryFormContainer>
      <Switch
        value={isRawMode}
        label={t('RAW_MODE')}
        onChange={() => setIsRawMode(!isRawMode)}
      />

      {
        isRawMode
          ? <Textarea
            {...form.fields.callData}
            label={t('CALL_DATA')}
            maxLength={1000}
          />
          : <>
            <Select
              {...form.fields.upgradeName}
              label={t('UPGRADE_TYPE')}
              placeholder={t('TYPE')}
              options={upgradeNameOptions}
            />
            <DAORegistryArgsForm
              key={form.values.upgradeName}
              formId={formId}
              formValidatesMap={formValidatesMap}
              functionName={form.values.upgradeName}
              setCallData={form.fields.callData.onChange}
              decodedCallData={decodedCallData}
              abiName={abiName}
            />
          </>
      }
    </DAORegistryFormContainer>
  );
}

export default DAORegistryForm;
