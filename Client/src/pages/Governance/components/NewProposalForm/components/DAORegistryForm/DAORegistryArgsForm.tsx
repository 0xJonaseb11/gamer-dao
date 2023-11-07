import { MutableRefObject, useEffect } from 'react';

import { useForm } from '@q-dev/form-hooks';
import { getEncodedData } from '@q-dev/gdk-sdk';
import { generateInitialFieldsByABI } from 'helpers/dao-form';
import { DecodedCallData } from 'typings/dao';
import { FormValidatesMap } from 'typings/forms';

import Input from 'components/Input';
import Textarea from 'components/Textarea';

interface Props {
  abiName: string;
  formId: string;
  formValidatesMap: MutableRefObject<FormValidatesMap>;
  functionName: string;
  decodedCallData: DecodedCallData | null;
  setCallData: (value: string) => void;
}

function DAORegistryArgsForm ({
  functionName,
  formId,
  formValidatesMap,
  setCallData,
  decodedCallData,
  abiName,
}: Props) {
  const { initialValues, validators, fieldsInfo } = generateInitialFieldsByABI({
    abiName,
    functionName,
    decodedCallData
  });

  const form = useForm<string, string>({
    initialValues,
    validators
  });

  const fieldValues = fieldsInfo.map(({ key }) => form.values[key]);

  useEffect(() => {
    try {
      if (fieldsInfo.length && fieldsInfo.every(({ key }) => form.validateByKey(key, true))) {
        const callData = getEncodedData(abiName, functionName, ...fieldValues);
        setCallData(callData);
      } else {
        setCallData('');
      }
    } catch (e) {
      setCallData('');
    }
  }, [...fieldValues, abiName, functionName]);

  useEffect(() => {
    formValidatesMap.current[formId] = form.validate;

    return () => {
      delete formValidatesMap.current[formId];
    };
  }, [form.validate]);

  return (
    <>
      {fieldsInfo.map(({ key, label, placeholder, type }, index) =>
        type === 'bytes'
          ? (
            <Textarea
              {...form.fields[key]}
              key={index + key}
              label={label}
              placeholder={placeholder}
            />
          )
          : (
            <Input
              {...form.fields[key]}
              key={index + key}
              label={label}
              placeholder={placeholder}
            />
          )
      )}
    </>
  );
}

export default DAORegistryArgsForm;
