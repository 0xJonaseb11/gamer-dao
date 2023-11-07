import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Icon } from '@q-dev/q-ui-kit';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import Button from 'components/Button';

import TxDetails from './components/TxDetails';
import TxHeaderTitle from './components/TxHeaderTitle';
import WalletAddress from './components/WalletAddress';
import WalletBaseInfo from './components/WalletBaseInfo';

import { useTransaction } from 'store/transaction/hooks';

const WalletDropdownWrapper = styled(Dropdown)`
.wallet-dropdown__address-content {
  max-width: 290px;
  min-width: 280px;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  box-shadow:
    0 4px 4px ${({ theme }) => theme.colors.blockShadowDark},
    0 -1px 2px ${({ theme }) => theme.colors.blockShadowLight};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
}

.wallet-dropdown__address-title {
  padding: 24px 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0;
}
`;

function WalletDropdown () {
  const { t } = useTranslation();

  const { pendingTransactions } = useTransaction();

  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isTxOpened, setIsTxOpened] = useState(false);

  const handleAddressDropdown = (val: boolean) => {
    setIsAddressOpen(val);
    if (!val) return;

    setIsTxOpened(false);
  };

  return (
    <WalletDropdownWrapper
      right
      open={isAddressOpen}
      trigger={
        <Button
          alwaysEnabled
          loading={pendingTransactions.length > 0}
          look="secondary"
          active={isAddressOpen}
        >
          {pendingTransactions.length > 0
            ? t('COUNT_PENDING', { count: pendingTransactions.length })
            : <WalletAddress />
          }
          <motion.span
            style={{ height: '100%' }}
            animate={{
              rotate: isAddressOpen ? 180 : 0,
            }}
          >
            <Icon name="expand-more" />
          </motion.span>
        </Button>
      }
      onToggle={handleAddressDropdown}
    >
      <div className="wallet-dropdown__address-content">
        <h3 className="wallet-dropdown__address-title text-xl font-semibold">
          {isTxOpened
            ? <TxHeaderTitle onClick={() => setIsTxOpened(false)} />
            : <WalletAddress />
          }
        </h3>

        {isTxOpened
          ? <TxDetails />
          : <WalletBaseInfo onClick={() => setIsTxOpened(true)} />
        }
      </div>
    </WalletDropdownWrapper>
  );
}

export default WalletDropdown;
