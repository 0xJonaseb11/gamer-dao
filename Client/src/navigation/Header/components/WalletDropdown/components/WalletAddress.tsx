
import { trimString } from '@q-dev/utils';

import AddressIcon from 'components/Custom/AddressIcon';

import { useProviderStore } from 'store/provider/hooks';

function WalletAddress () {
  const { userAddress } = useProviderStore();

  return (
    <>
      <AddressIcon address={userAddress} size={20} />
      <span>{trimString(userAddress)}</span>
    </>
  );
}

export default WalletAddress;
