import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route } from 'react-router';
import { Link } from 'react-router-dom';

import { Icon } from '@q-dev/q-ui-kit';

import LazyLoading from 'components/Base/LazyLoading';
import Button from 'components/Button';
import PageLayout from 'components/PageLayout';
import Tabs from 'components/Tabs';
import { TabRoute, TabSwitch } from 'components/Tabs/components';

import { useDaoStore } from 'store/dao/hooks';
import { useExpertPanels } from 'store/expert-panels/hooks';

import { RoutePaths } from 'constants/routes';

const DaoContractRegistry = lazy(() => import('./components/DaoContractRegistry'));
const DaoPanelParameters = lazy(() => import('./components/DaoPanelParameters'));

function Parameters () {
  const { t } = useTranslation();
  const { composeDaoLink } = useDaoStore();
  const { allPanels } = useExpertPanels();

  const panelTabs = allPanels.map((panel, i) => ({
    id: panel,
    label: panel,
    link: composeDaoLink(`/parameters/panel-${i}`)
  }));

  const tabs = [
    {
      id: 'contract-registry',
      label: t('CONTRACT_REGISTRY'),
      link: composeDaoLink(RoutePaths.contractRegistry)
    },
    ...panelTabs
  ];

  return (
    <PageLayout
      title={t('PARAMETERS')}
      action={
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to={composeDaoLink(RoutePaths.dashboard)}>
            <Button
              block
              alwaysEnabled
              look="secondary"
            >
              <Icon name="dashboard" />
              <span>{t('DASHBOARD')}</span>
            </Button>
          </Link>
        </div>
      }
    >
      <Tabs tabs={tabs} />

      <TabSwitch>
        <>
          <Route exact path={composeDaoLink(RoutePaths.parameters)}>
            <Redirect to={composeDaoLink(RoutePaths.contractRegistry)} />
          </Route>

          <TabRoute exact path={composeDaoLink(RoutePaths.contractRegistry)}>
            <LazyLoading>
              <DaoContractRegistry />
            </LazyLoading>
          </TabRoute>

          {panelTabs.map((tab) => (
            <TabRoute
              key={tab.id}
              exact
              path={tab.link}
            >
              <LazyLoading>
                <DaoPanelParameters panel={tab.id} />
              </LazyLoading>
            </TabRoute>
          ))}
        </>
      </TabSwitch>
    </PageLayout>
  );
}

export default Parameters;
