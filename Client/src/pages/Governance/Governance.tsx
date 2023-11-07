import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { Icon, Illustration } from '@q-dev/q-ui-kit';

import Button from 'components/Button';
import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';
import Tabs from 'components/Tabs';
import { TabRoute, TabSwitch } from 'components/Tabs/components';

import Proposals from './components/Proposals';
import { ListEmptyStub } from './components/Proposals/styles';
import VotingStats from './components/VotingStats';

import { useDaoStore } from 'store/dao/hooks';
import { useExpertPanels } from 'store/expert-panels/hooks';

import { RoutePaths } from 'constants/routes';

function Governance () {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { loadExpertPanels, allPanels } = useExpertPanels();

  const { composeDaoLink } = useDaoStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadAllPanels = async () => {
    setIsLoading(true);
    await loadExpertPanels();
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllPanels();
  }, []);

  const tabs = useMemo(() => {
    return allPanels.map((name, index) => ({
      id: index,
      label: name,
      link: composeDaoLink(`/governance/panel-${index}`),
    }));
  }, [allPanels]);

  const pathToNewProposalPath = tabs.reduce((acc: Record<string, string>, item) => {
    acc[item.link] = `${item.link}/new`;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!tabs.length) {
    return (
      <ListEmptyStub>
        <Illustration type="empty-list" />
        <p className="text-lg font-semibold">{t('NO_PANELS_FOUND')}</p>
      </ListEmptyStub>
    );
  }

  return (
    <PageLayout
      title={t('GOVERNANCE')}
      action={(
        <Link to={pathToNewProposalPath[pathname] || composeDaoLink(RoutePaths.newProposal)}>
          <Button block>
            <Icon name="add" />
            <span>{t('CREATE_PROPOSAL')}</span>
          </Button>
        </Link>
      )}
    >
      <VotingStats />
      <Tabs tabs={tabs} />
      <TabSwitch>
        <>
          <Route exact path={'/:address' + RoutePaths.governance}>
            <Redirect to={tabs[0].link} />
          </Route>
          {tabs.map(({ id, label, link }) => (
            <TabRoute
              key={id}
              exact
              path={link}
            >
              <Proposals panelName={label} />
            </TabRoute>
          ))}
        </>
      </TabSwitch>
    </PageLayout>
  );
}

export default Governance;
