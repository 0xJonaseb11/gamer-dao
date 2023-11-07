import { HTMLAttributes } from 'react';

import { Button as UiButton } from '@q-dev/q-ui-kit';
import { ButtonLook } from '@q-dev/q-ui-kit/dist/components/Button/Button';

import { useProviderStore } from 'store/provider/hooks';

import { StyledCustom } from 'components/styles';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  look?: ButtonLook;
  disabled?: boolean;
  alwaysEnabled?: boolean;
  icon?: boolean;
  compact?: boolean;
  loading?: boolean;
  active?: boolean;
  block?: boolean;
}

function Button ({
  type,
  look,
  disabled,
  alwaysEnabled,
  icon,
  compact,
  loading,
  active,
  block,
  children,
  className,
  onClick,
  ...rest
}: Props) {
  const { currentProvider, isRightNetwork } = useProviderStore();

  const isDisabled = disabled ||
    (!alwaysEnabled && (!currentProvider?.isConnected || !isRightNetwork));

  return (
    <StyledCustom>
      <UiButton
        className={className}
        type={type}
        block={block}
        disabled={isDisabled}
        look={look}
        icon={icon}
        compact={compact}
        loading={loading}
        active={active}
        onClick={onClick}
        {...rest}
      >
        {children}
      </UiButton>
    </StyledCustom>
  );
}

export default Button;
