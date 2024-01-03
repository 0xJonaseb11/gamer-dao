import { getValidatorValue } from '@q-dev/form-hooks';
import { getDecodeData, ParameterType } from '@q-dev/gdk-sdk';
import { toBigNumber } from '@q-dev/utils';
import { isAddress, isBytesLike } from 'helpers';
import i18n from 'i18next';
import { isBoolean } from 'lodash';
import isDate from 'lodash/isDate';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

import { ZERO_ADDRESS } from 'constants/boundaries';

const HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;
const BYTES_REGEX = /^0x[a-fA-F0-9]{2,64}$/;
const VAULT_ID_REGEX = /^[0-9]{1,18}$/;
const NAME_REGEX = /^[A-Za-z0-9]+[A-Za-z0-9_\-. ]*[A-Za-z0-9]+$/;
export const URL_REGEX = /^(https?:\/\/)?(www\.)?[-äöüa-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-äöüa-zA-Z0-9()@:%_+.~#?&//=]*)/;

interface ValidationResult {
  isValid: boolean;
  message: string;
}
type ValidatorValue = string | number | boolean | Date | ParameterType | File | null;
export type Validator<T extends ValidatorValue = ValidatorValue, U = unknown> = (val: T, form?: U) => ValidationResult;
type ValidatorFn<U, T extends ValidatorValue = ValidatorValue> = (val: U | ((form: unknown) => T)) => Validator<T>;

export const required: Validator = (val) => ({
  isValid: !isEmpty(val) || isNumber(val) || isDate(val) || isBoolean(val) || val instanceof File,
  message: i18n.t('VALIDATION_REQUIRED')
});

export const requiredIf: ValidatorFn<(val: ValidatorValue, form: unknown) => boolean> = predicate => (val, form) => {
  return {
    isValid: !predicate(val, form) || required(val).isValid,
    message: i18n.t('VALIDATION_REQUIRED')
  };
};

export const amount: ValidatorFn<string | number> = max => (val, form) => {
  const value = toBigNumber(String(val));
  const zero = toBigNumber(0);
  const validatorValue = toBigNumber(String(getValidatorValue(max, form)));

  if (value.comparedTo(zero) === 0) {
    return {
      isValid: false,
      message: i18n.t('VALIDATION_AMOUNT_COMPARED_ZERO')
    };
  }

  if (validatorValue.comparedTo(toBigNumber(0)) === 0) {
    return {
      isValid: false,
      message: i18n.t('VALIDATION_AVAILABLE_AMOUNT_ZERO')
    };
  }

  return {
    isValid: value.comparedTo(validatorValue) <= 0,
    message: i18n.t('VALIDATION_MAX_AMOUNT', { max })
  };
};

export const min: ValidatorFn<string | number> = min => (val, form) => {
  const value = toBigNumber(String(val));
  const validatorValue = toBigNumber(String(getValidatorValue(min, form)));

  return {
    isValid: value.comparedTo(validatorValue) >= 0,
    message: i18n.t('VALIDATION_MIN_VALUE', { min })
  };
};

export const addressInGroup: ValidatorFn<string[]> = list => val => {
  return {
    isValid: !(list as string[]).find(item => item === val),
    message: i18n.t('VALIDATION_ADDRESS_IN_GROUP')
  };
};

export const addressOutGroup: ValidatorFn<string[]> = list => val => {
  return {
    isValid: !!(list as string[]).find(item => item === val),
    message: i18n.t('VALIDATION_ADDRESS_OUT_GROUP')
  };
};

export const max: ValidatorFn<string | number> = max => (val, form) => {
  const value = toBigNumber(String(val));
  const validatorValue = toBigNumber(String(getValidatorValue(max, form)));

  return {
    isValid: value.comparedTo(validatorValue) <= 0,
    message: i18n.t('VALIDATION_MAX_VALUE', { max })
  };
};

export const url: Validator = val => ({
  isValid: !val || URL_REGEX.test(String(val)),
  message: i18n.t('VALIDATION_URL')
});

export const address: Validator<string> = val => ({
  isValid: !val || isAddress(val),
  message: i18n.t('VALIDATION_ADDRESS')
});

export const bytes: Validator<string> = val => ({
  isValid: !val || isBytesLike(val),
  message: i18n.t('VALIDATION_BYTES')
});

export const nonZeroAddress: Validator<string> = val => ({
  isValid: !val || (isAddress(val) && val !== ZERO_ADDRESS),
  message: i18n.t('VALIDATION_ADDRESS')
});

export const vaultID: Validator = val => ({
  isValid: !val || VAULT_ID_REGEX.test(String(val)),
  message: i18n.t('VALIDATION_VAULT_UD')
});

export const hash: Validator = val => ({
  isValid: !val || HASH_REGEX.test(String(val)),
  message: i18n.t('VALIDATION_HASH')
});

export const currentHash: ValidatorFn<string> = hash => val => ({
  isValid: !val || val === hash,
  message: i18n.t('VALIDATION_CURRENT_HASH')
});

export const percent: Validator = val => ({
  isValid: !val || (Number(val) >= 0 && Number(val) <= 100),
  message: i18n.t('VALIDATION_PERCENT')
});

export const parameterType: ValidatorFn<ParameterType> = type => (val, form) => {
  const typeValue = getValidatorValue(type, form);
  if (!val) return { isValid: true, message: '' };

  switch (typeValue) {
    case ParameterType.ADDRESS:
      return {
        isValid: isAddress(String(val)),
        message: i18n.t('VALIDATION_ADDRESS')
      };

    case ParameterType.BOOL:
      return {
        isValid: ['true', 'false'].includes(String(val).toLowerCase()),
        message: i18n.t('VALIDATION_BOOLEAN_VALUE')
      };

    case ParameterType.STRING:
      return {
        isValid: String(val).length <= 1024,
        message: i18n.t('VALIDATION_STRING_VALUE')
      };

    case ParameterType.BYTES:
      const hash = val.toString().split('0x')[1];
      const isValidByte = !!hash && hash.length % 2 !== 1;
      return {
        isValid: BYTES_REGEX.test(String(val)) && isValidByte,
        message: i18n.t('VALIDATION_BYTES_VALUE')
      };
    case ParameterType.UINT256:
      return {
        isValid: !toBigNumber(String(val)).isNaN(),
        message: i18n.t('VALIDATION_UINT_VALUE')
      };

    default:
      return { isValid: true, message: '' };
  }
};

export const futureDate: Validator = val => ({
  isValid: !val || new Date(val.toString()) > new Date(),
  message: i18n.t('VALIDATION_FUTURE_DATE')
});

export const number: Validator = val => ({
  isValid: isNumber(Number(val)) && !isNaN(Number(val)),
  message: i18n.t('VALIDATION_NUMBER_VALUE')
});

export const integer: Validator = val => ({
  isValid: Number.isInteger(Number(val)),
  message: i18n.t('VALIDATION_INTEGER_NUMBER_VALUE')
});

export const name: Validator = val => ({
  isValid: !val || NAME_REGEX.test(String(val)),
  message: i18n.t('VALIDATION_NAME')
});

export const callData = ({ functionNames, abiName }: {functionNames: string[]; abiName: string}): Validator =>
  (val) => {
    let isValid: boolean;
    try {
      const decodedData = val ? getDecodeData(abiName, String(val)) : null;
      isValid = Boolean(decodedData) && functionNames.some(name => name === decodedData?.functionName);
    } catch (e) {
      isValid = false;
    }

    return { isValid, message: i18n.t('VALIDATION_CALL_DATA') };
  };
