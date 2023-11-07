import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Illustration } from '@q-dev/q-ui-kit';

import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';
import Tabs from 'components/Tabs';
import { TabRoute, TabSwitch } from 'components/Tabs/components';

import NewProposalForm from './components/NewProposalForm';
import { ListEmptyStub } from './components/Proposals/styles';

import { useDaoStore } from 'store/dao/hooks';
import { useExpertPanels } from 'store/expert-panels/hooks';

function NewProposal () {
  const { t } = useTranslation();
  const { loadExpertPanels, allPanels } = useExpertPanels();
  const { composeDaoLink } = useDaoStore();
  const [isLoading, setIsLoading] = useState(true);

  const tabs = useMemo(() => {
    return allPanels.map((name, index) => ({
      id: index,
      label: name,
      link: composeDaoLink(`/governance/panel-${index}/new`),
    }));
  }, [allPanels]);

  const loadAllPanels = async () => {
    setIsLoading(true);
    await loadExpertPanels();
    setIsLoading(false);
  };

  useEffect(() => { loadAllPanels(); }, []);

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
    <PageLayout title={t('NEW_PROPOSAL')}>
      <Tabs tabs={tabs} />
      <TabSwitch>
        <>
          {tabs.map(({ id, label, link }) => (
            <TabRoute
              key={id}
              exact
              path={link}
            >
              <NewProposalForm panelName={label} />
            </TabRoute>
          ))}
        </>
      </TabSwitch>
    </PageLayout>
  );
}

export default NewProposal;
