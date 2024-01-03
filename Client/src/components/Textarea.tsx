import { ComponentProps } from 'react';

import { Textarea as UiTextarea } from '@q-dev/q-ui-kit';
import { useWeb3Context } from 'context/Web3ContextProvider';

import InfoTooltip from 'components/InfoTooltip';

interface Props extends ComponentProps<typeof UiTextarea> {
  label: string;
  alwaysEnabled?: boolean;
  labelTooltip?: string;
}

function Textarea ({
  disabled,
  alwaysEnabled,
  children,
  labelTooltip,
  label,
  ...rest
}: Props) {
  const { currentProvider, isRightNetwork } = useWeb3Context();
  const isDisabled = disabled || (!alwaysEnabled && (!currentProvider?.isConnected || !isRightNetwork));

  return (
    <UiTextarea
      disabled={isDisabled}
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
      {...rest}
    >
      {children}
    </UiTextarea>
  );
};

export default Textarea;
