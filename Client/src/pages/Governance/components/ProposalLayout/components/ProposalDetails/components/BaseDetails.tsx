import { useTranslation } from 'react-i18next';

import { ProposalBaseInfo } from 'typings/proposals';

import RemarkViewer from '../../RemarkViewer';

interface Props {
  proposal: ProposalBaseInfo;
}

function BaseDetails ({ proposal }: Props) {
  const { t } = useTranslation();

  return (
    <div className="details-list-item">
      <div className="details-item">
        <p className="text-md color-secondary">{t('EXTERNAL_SOURCE')}</p>
        <RemarkViewer remark={proposal.remark} />
      </div>
    </div>
  );
}

export default BaseDetails;
