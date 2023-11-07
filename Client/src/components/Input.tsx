import { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';

import { Input as UiInput } from '@q-dev/q-ui-kit';

import InfoTooltip from 'components/InfoTooltip';

import { useProviderStore } from 'store/provider/hooks';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
interface Props extends Omit<InputProps, 'onChange' | 'prefix' | 'value'> {
  value: string | number | boolean;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  decimals?: number;
  max?: string;
  prefix?: ReactNode;
  children?: ReactNode;
  labelTip?: string;
  alwaysEnabled?: boolean;
  onChange: (val: string) => void;
  labelTooltip?: string;
}

function Input ({
  value,
  label,
  error,
  type,
  disabled,
  hint,
  max,
  decimals,
  prefix,
  labelTip,
  children,
  onChange,
  alwaysEnabled,
  labelTooltip,
  ...rest
}: Props) {
  const { currentProvider, isRightNetwork } = useProviderStore();

  const isDisabled = disabled || (!alwaysEnabled && (!currentProvider?.isConnected || !isRightNetwork));

  return (
    <UiInput
      value={value}
      label={labelTooltip
        ? (
          <div style={{ display: 'flex' }}>
            <span>
              {label}
            </span>
            <InfoTooltip description={labelTooltip} />
          </div>
        )
        : label
      }
      error={error}
      type={type}
      disabled={isDisabled}
      decimals={decimals}
      labelTip={labelTip}
      hint={hint}
      max={max}
      prefix={prefix}
      onChange={onChange}
      {...rest}
    >
      {children}
    </UiInput>
  );
};

export default Input;
