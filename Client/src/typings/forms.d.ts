import { ParameterType } from '@q-dev/gdk-sdk';

interface FormParameter {
  type: ParameterType;
  key: string;
  value: string;
  isNew?: boolean;
}

interface ParameterKey {
  name: string;
  solidityType: string;
  value: string;
}

type GeneralSituationType = 'raise-topic' | 'create-voting' | 'remove-voting';
type MembershipSituationType = 'add-member' | 'remove-member';
type ParameterSituationType = 'configuration' | 'regular' | 'aggregate';

interface NewProposalForm {
  type: string;
  panel: string;
  generalSituationType: GeneralSituationType;
  membershipSituationType: MembershipSituationType;
  candidateAddress: string;
  hash: string;
  remark: string;
  isParamsChanged: boolean;
  params: FormParameter[];
  callData: string[];
  rewardToken: string;
  amount: string;
  rewardAmount: any;
  merkleRoot: string;
  startTimestamp: string;
  endTimestamp: string;
  eligibleAddresses: string[];
}

interface FormDAORegistry {
  callData: string;
  upgradeName: string;
}

type FormValidatesMap = Record<string, () => boolean>;
