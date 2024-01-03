import { useTranslation } from 'react-i18next';

import { DecodedData } from '@q-dev/gdk-sdk';
import { ProposalBaseInfo } from 'typings/proposals';

import BaseDetails from './components/BaseDetails';
import MembershipSituationsProposalDetails from './components/MembershipSituationsProposalDetails';

interface Props {
  proposal: ProposalBaseInfo;
  membershipSituationsDecodedCallData: DecodedData | null;
}

function ProposalDetails ({ proposal, membershipSituationsDecodedCallData }: Props) {
  const { t } = useTranslation();

  return (
    <div className="block">
      <h2 className="text-h2">{t('DETAILS')}</h2>

      <div className="block__content">
        <div className="details-list single-column">
          {membershipSituationsDecodedCallData !== null && (
            <MembershipSituationsProposalDetails
              decodedCallData={membershipSituationsDecodedCallData}
            />
          )}
          <BaseDetails proposal={proposal} />
        </div>
      </div>
    </div>
  );
}

export default ProposalDetails;
