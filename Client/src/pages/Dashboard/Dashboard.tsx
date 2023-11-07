import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Icon, media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

import PageLayout from 'components/PageLayout';

import ConstitutionBlock from './components/ConstitutionBlock';
import DaoTokenSupply from './components/DaoTokenSupply';
import ExpertPanelBlock from './components/ExpertPanelBlock';
import TotalExpertPanels from './components/TotalExpertPanels';

import { useDaoStore } from 'store/dao/hooks';
import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useExpertPanels } from 'store/expert-panels/hooks';

import { RoutePaths } from 'constants/routes';

export const StyledWrapper = styled.div`
  display: grid;
  gap: 24px;

  .dashboard__general,
  .dashboard__panels {
    display: grid;
    gap: 24px;

    ${media.lessThan('large')} {
      gap: 16px;
    }
  }

  .dashboard__general {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    ${media.lessThan('medium')} {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .dashboard__panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    
    ${media.lessThan('medium')} {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

function Dashboard () {
  const { t } = useTranslation();
  const { composeDaoLink } = useDaoStore();
  const { tokenInfo } = useDaoTokenStore();
  const { expertPanels } = useExpertPanels();

  return (
    <PageLayout
      title={t('DASHBOARD')}
      action={
        <Link to={composeDaoLink(RoutePaths.parameters)}>
          <Button block>
            <Icon name="list" />
            <span>{t('PARAMETERS')}</span>
          </Button>
        </Link>
      }
    >
      <StyledWrapper>
        <div className="dashboard__general">
          <ConstitutionBlock />
          {tokenInfo && <DaoTokenSupply />}
          <TotalExpertPanels />
        </div>

        <div className="dashboard__panels">
          {expertPanels.map((panel, index) => (
            <ExpertPanelBlock key={index} name={panel} />
          ))}
        </div>
      </StyledWrapper>
    </PageLayout>
  );
}

export default Dashboard;
