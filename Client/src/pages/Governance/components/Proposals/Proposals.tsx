import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Illustration } from '@q-dev/q-ui-kit';
import { fillArray } from '@q-dev/utils';
import { DaoProposal, ProposalBaseInfo } from 'typings/proposals';

import Button from 'components/Button';

import { useDaoProposals } from 'hooks/useDaoProposals';

import ProposalCard from './components/ProposalCard';
import ProposalCardSkeleton from './components/ProposalCardSkeleton';
import { ListEmptyStub, ListNextContainer, ListWrapper } from './styles';

const PAGE_LIMIT = 10;

function Proposals ({ panelName }: { panelName: string }) {
  const { t } = useTranslation();
  const { getProposalsList, getProposalBaseInfo } = useDaoProposals();
  const [list, setList] = useState<ProposalBaseInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationAvailable, setIsPaginationAvailable] = useState(true);

  const loadProposalsList = async () => {
    setIsLoading(true);
    const newList = (await getProposalsList(panelName, offset, PAGE_LIMIT) || []) as DaoProposal[];
    const futureList = await getProposalsList(panelName, offset + PAGE_LIMIT, PAGE_LIMIT) || []; // need to optimize
    const preparedProposalList = await Promise.all(
      newList.map(item => getProposalBaseInfo(item.relatedExpertPanel, item.id.toString()))
    );
    setList(preparedProposalList as ProposalBaseInfo[]);
    setIsPaginationAvailable(newList.length === PAGE_LIMIT && futureList.length === PAGE_LIMIT);
    setIsLoading(false);
  };

  const handleNextProposals = async () => {
    const newOffset = offset + PAGE_LIMIT;
    const newList = (await getProposalsList(panelName, newOffset, PAGE_LIMIT) || []) as DaoProposal[];
    const futureList = await getProposalsList(panelName, newOffset + PAGE_LIMIT, PAGE_LIMIT) || []; // need to optimize
    const preparedProposalList = await Promise.all(
      newList.map(item => getProposalBaseInfo(item.relatedExpertPanel, item.id.toString()))
    );
    setList(oldList => [...oldList, ...preparedProposalList] as ProposalBaseInfo[]);
    setIsPaginationAvailable(newList.length === PAGE_LIMIT && futureList.length === PAGE_LIMIT);
    setOffset(newOffset);
  };

  useEffect(() => {
    loadProposalsList();

    return () => {
      setList([]);
    };
  }, [panelName]);

  if (isLoading) {
    return (
      <ListWrapper>
        {fillArray(10).map((id) => (
          <ProposalCardSkeleton key={id} />
        ))}
      </ListWrapper>
    );
  }

  if (list.length === 0) {
    return (
      <ListEmptyStub>
        <Illustration type="empty-list" />
        <p className="text-lg font-semibold">{t('NO_PROPOSALS_FOUND')}</p>
      </ListEmptyStub>
    );
  }

  return (
    <>
      <ListWrapper>
        {list.map((proposal, index) => (
          <ProposalCard
            key={index}
            proposal={proposal}
          />
        ))}
      </ListWrapper>

      {isPaginationAvailable && (
        <ListNextContainer>
          <Button
            alwaysEnabled
            onClick={handleNextProposals}
          >
            {t('SHOW_MORE')}
          </Button>
        </ListNextContainer>
      )}
    </>
  );
}

export default Proposals;
