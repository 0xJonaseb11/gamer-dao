import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

import Button from 'components/Button';

const TxHeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .tx-header-title__button {
    max-height: 28px;
    max-width: 28px;
  }
`;

interface Props {
  onClick: () => void;
}

function TxHeaderTitle ({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <TxHeaderTitleWrapper>
      <Button
        icon
        alwaysEnabled
        block
        compact
        look="ghost"
        className="tx-header-title__button"
        onClick={onClick}
      >
        <Icon name="arrow-left" />
      </Button>
      <span>
        {t('USER_TRANSACTIONS')}
      </span>
    </TxHeaderTitleWrapper>

  );
}

export default TxHeaderTitle;
