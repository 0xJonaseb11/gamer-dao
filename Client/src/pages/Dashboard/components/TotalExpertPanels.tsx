import { useTranslation } from 'react-i18next';

import styled from 'styled-components';

import { useExpertPanels } from 'store/expert-panels/hooks';

const StyledWrapper = styled.div`
  padding: 24px 16px 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total-expert-panels__val {
    margin-top: 4px;
  }

  .total-expert-panels__proposals {
    margin-top: 16px;
    display: flex;
    gap: 4px;
  }
`;

function TotalExpertPanels () {
  const { t } = useTranslation();
  const { expertPanels } = useExpertPanels();
  // TODO: get from contract
  const activeProposalsCount = 0;

  return (
    <StyledWrapper className="block">
      <div>
        <h2 className="text-lg">📦 Total Expert Panel</h2>
        <p className="total-expert-panels__val text-xl font-semibold">
          {expertPanels.length}
        </p>
        <p className="total-expert-panels__proposals text-sm">
          <span className="font-light">{t('ACTIVE_PROPOSALS_COUNT')}</span>
          <span>{activeProposalsCount}</span>
        </p>
      </div>
    </StyledWrapper>
  );
}

export default TotalExpertPanels;
