
import { trimString } from '@q-dev/utils';

import useNetworkConfig from 'hooks/useNetworkConfig';

import Address from '../Address';

import { ExplorerLink } from './styles';

function ExplorerAddress ({
  address,
  short = false,
  ...rest
}: Parameters<typeof Address>[0]) {
  const { explorerUrl } = useNetworkConfig();

  return (
    <Address
      address={address}
      short={short}
      {...rest}
    >
      <ExplorerLink
        href={`${explorerUrl}/address/${address}`}
        target="_blank"
        rel="noreferrer"
        title="View on Explorer"
      >
        <p className="ellipsis" style={{ marginBottom: 0 }}>
          {short ? trimString(address) : address}
        </p>
      </ExplorerLink>
    </Address>
  );
}

export default ExplorerAddress;
