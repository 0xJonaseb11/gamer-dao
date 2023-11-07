import { JsonFragment } from '@ethersproject/abi';
import { getContractInterface } from '@q-dev/gdk-sdk/lib/abi/ABIImporter';
import startCase from 'lodash/startCase';
import { DecodedCallData } from 'typings/dao';

import { address, bytes, name, required, Validator } from 'utils/validators';

interface InitialFields {
  fieldsInfo: {
    key: string;
    type: string;
    label: string;
    placeholder: string;
  }[];
  initialValues: Record<string, string>;
  validators: Record<string, Validator<string>[]>;
}

export function generateInitialFieldsByABI ({
  abiName,
  functionName,
  decodedCallData,
}: {
  abiName: string;
  functionName: string;
  decodedCallData?: DecodedCallData | null;
}): InitialFields {
  const abi: ReadonlyArray<JsonFragment> = getContractInterface(`${abiName}.json`);
  const funcInputs = abi.find((item) => item?.name === functionName)?.inputs || [];
  const isEqualFunction = functionName === decodedCallData?.functionName;

  return funcInputs.map(i => i).reduce((acc, item) => {
    if (!item?.name || !item?.type) return acc;
    acc.initialValues[item.name] = isEqualFunction
      ? decodedCallData?.arguments?.[item.name] || ''
      : '';

    acc.fieldsInfo.push({
      key: item.name,
      type: item.type,
      label: startCase(item.name),
      placeholder: `${startCase(item.type)} type`,
    });

    switch (item.type) {
      case 'string':
        acc.validators[item.name] = [
          required,
          ...(item.name === 'name_' ? [name] : [])
        ];
        break;
      case 'address':
        acc.validators[item.name] = [required, address];
        break;
      case 'bytes':
        acc.validators[item.name] = [required, bytes];
        break;
      default:
        acc.validators[item.name] = [];
        break;
    }

    return acc;
  }, {
    fieldsInfo: [],
    initialValues: {},
    validators: {}
  } as InitialFields);
}
