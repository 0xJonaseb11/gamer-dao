
import { HTMLAttributes, ReactNode } from 'react';

import { trimString } from '@q-dev/utils';

import CopyToClipboard from 'components/CopyToClipboard';

import AddressIcon from '../AddressIcon';

import { AddressWrapper } from './styles';

interface Props extends HTMLAttributes<HTMLDivElement> {
  address: string;
  short?: boolean;
  hideTooltip?: boolean;
  iconed?: boolean;
  semibold?: boolean;
  children?: ReactNode;
  iconSize?: number;
}

function Address ({
  address,
  short = false,
  hideTooltip = false,
  iconed = false,
  semibold = false,
  children = null,
  iconSize = 20,
  ...rest
}: Props) {
  const addressContent = (
    <p>{short ? trimString(address) : address}</p>
  );

  return (
    <AddressWrapper $semibold={semibold} {...rest}>
      {iconed && (
        <AddressIcon
          address={address}
          size={iconSize}
          style={{ marginRight: '8px' }}
        />
      )}
      {children || addressContent}

      <CopyToClipboard
        value={address}
        hideTooltip={hideTooltip}
      />
    </AddressWrapper>
  );
}

export default Address;
