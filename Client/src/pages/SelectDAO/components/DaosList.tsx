
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { media } from '@q-dev/q-ui-kit';
import daosDevnet from 'json/daos-devnet.json';
import daosMainnet from 'json/daos-mainnet.json';
import daosTestnet from 'json/daos-testnet.json';
import styled from 'styled-components';

import useNetworkConfig from 'hooks/useNetworkConfig';

import DaoCard from './DaoCard';

const StyledWrapper = styled.div`
  display: grid;
  gap: 16px;

  .daos-list__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    ${media.lessThan('large')} {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }
`;

function DaosList () {
  const { t } = useTranslation();
  const { networkName } = useNetworkConfig();

  const daosList = useMemo(() => {
    switch (networkName) {
      case 'devnet':
        return daosDevnet;
      case 'testnet':
        return daosTestnet;
      case 'mainnet':
        return daosMainnet;
    }
  }, [networkName]);

  return (
    <StyledWrapper>
      <h3 className="text-h3">{t('DAO_EXPLORE')}</h3>
      <div className="daos-list__items">
        {daosList.map((dao, index) => (
          <DaoCard key={index} card={dao} />
        ))}
      </div>
    </StyledWrapper>
  );
}

export default DaosList;
