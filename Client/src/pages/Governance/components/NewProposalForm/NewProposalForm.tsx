import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { useMultiStepForm } from '@q-dev/form-hooks';
import { DefaultVotingSituations } from '@q-dev/gdk-sdk';
import { Illustration } from '@q-dev/q-ui-kit';
import { NewProposalForm as NewProposalFormType } from 'typings/forms';

import LoadingSpinner from 'components/LoadingSpinner';
import MultiStepForm from 'components/MultiStepForm';

import { useDaoProposals } from 'hooks/useDaoProposals';

import { ListEmptyStub } from '../Proposals/styles';

import AirDropV2DetailsStep from './components/AirDropV2DetailsStep';
import ConfirmationStep from './components/ConfirmationStep';
import ConstitutionHashStep from './components/ConstitutionHashStep';
import ConstitutionSituationStep from './components/ConstitutionSituationStep';
import DAORegistryBasicStep from './components/DAORegistryBasicStep';
import DAORegistrySituationStep from './components/DAORegistrySituationStep';
import GeneralSituationStep from './components/GeneralSituationStep';
import MembershipSituationStep from './components/MembershipSituationStep';
import ParameterSituationStep from './components/ParameterSituationStep';
import TypeStep from './components/TypeStep';

import { useDaoStore } from 'store/dao/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { RoutePaths } from 'constants/routes';

const DEFAULT_VALUES: NewProposalFormType = {
  type: '',
  panel: '',
  hash: '',
  candidateAddress: '',
  remark: '',
  membershipSituationType: 'add-member',
  generalSituationType: 'raise-topic',
  isParamsChanged: false,
  params: [],
  callData: [],
  rewardToken: '',
  amount: '',
  rewardAmount: '',
  merkleRoot: '',
  startTimestamp: '',
  endTimestamp: '',
  eligibleAddresses: []
};

const NewProposalContext = createContext(
  {} as ReturnType<typeof useMultiStepForm<typeof DEFAULT_VALUES>>
);

function NewProposalForm ({ panelName }: { panelName: string }) {
  const history = useHistory();
  const { t } = useTranslation();
  const { createNewProposal, getPanelSituations } = useDaoProposals();
  const { submitTransaction } = useTransaction();
  const { composeDaoLink } = useDaoStore();
  const [panelSituations, setPanelSituations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPanelSituations = async () => {
    setIsLoading(true);
    const situations = await getPanelSituations(panelName);
    setPanelSituations(situations || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPanelSituations();

    return () => {
      setPanelSituations([]);
    };
  }, [panelName]);

  const form = useMultiStepForm({
    initialValues: DEFAULT_VALUES,
    onConfirm: (form) => {
      submitTransaction({
        successMessage: t('CREATE_PROPOSAL_TX'),
        submitFn: () => createNewProposal(form),
        onSuccess: () => history.push(composeDaoLink(RoutePaths.governance))
      });
    },
  });

  const steps = useMemo(() => {
    return !isLoading && panelSituations.length
      ? [
        {
          id: 'type',
          name: t('PROPOSAL_TYPE'),
          title: t('TYPE_OF_Q_PROPOSAL'),
          children: <TypeStep situations={panelSituations} panelName={panelName} />
        },
        ...(form.values.type === DefaultVotingSituations.DAORegistry
          ? [
            {
              id: 'dao-registry-basic',
              name: t('BASIC_DETAILS'),
              title: t('BASIC_DETAILS'),
              children: <DAORegistryBasicStep />
            },
            {
              id: 'dao-registry-situation',
              name: t('DETAILS'),
              title: t('DETAILS'),
              children: <DAORegistrySituationStep />
            }
          ]
          : []
        ),
        ...(form.values.type === DefaultVotingSituations.General
          ? [{
            id: 'general-situation',
            name: t('DETAILS'),
            title: t('DETAILS'),
            children: <GeneralSituationStep />
          }]
          : []
        ),
        ...(form.values.type === 'AirDropV2'
          ? [{
            id: 'airdrop-v2',
            name: t('DETAILS'),
            title: t('DETAILS'),
            children: <AirDropV2DetailsStep />
          }]
          : []
        ),
        ...(form.values.type === DefaultVotingSituations.ConfigurationParameter
          ? [{
            id: 'configuration-parameter-situation',
            name: t('PARAMETERS'),
            title: t('CONFIG_PARAMETER_VOTE'),
            children: <ParameterSituationStep panelName={panelName} situation="configuration" />
          }]
          : []
        ),
        ...(form.values.type === DefaultVotingSituations.RegularParameter
          ? [{
            id: 'regular-parameter-situation',
            name: t('PARAMETERS'),
            title: t('EXPERT_PARAMETER_VOTE'),
            children: <ParameterSituationStep panelName={panelName} situation="regular" />
          }]
          : []
        ),
        ...(form.values.type === DefaultVotingSituations.Membership
          ? [{
            id: 'membership-situation',
            name: t('DETAILS'),
            title: t('INTERACTION_WITH_USER'),
            children: <MembershipSituationStep panelName={panelName} />
          }]
          : []
        ),
        ...(form.values.type === DefaultVotingSituations.Constitution
          ? [
            {
              id: 'constitution-situation-1',
              name: t('BASIC_DETAILS'),
              title: t('BASIC_DETAILS'),
              children: <ConstitutionHashStep />
            },
            {
              id: 'constitution-situation-2',
              name: t('PARAMETERS'),
              title: t('CHANGE_OF_CONSTITUTION_PARAMETERS'),
              children: <ConstitutionSituationStep panelName={panelName} />
            },
          ]
          : []
        ),
        {
          id: 'confirm',
          name: t('CONFIRMATION'),
          title: t('CONFIRMATION'),
          tip: t('CONFIRMATION_TIP'),
          children: <ConfirmationStep />
        }
      ]
      : [];
  }, [form.values.type, panelName, isLoading, panelSituations]);

  if (isLoading) {
    return (
      <LoadingSpinner size={60} />
    );
  }

  if (!panelSituations.length) {
    return (
      <ListEmptyStub>
        <Illustration type="empty-list" />
        <p className="text-lg font-semibold">{t('NO_SITUATIONS_FOUND')}</p>
      </ListEmptyStub>
    );
  }

  return (
    <NewProposalContext.Provider value={form}>
      <MultiStepForm
        stepIndex={form.stepIndex}
        steps={steps}
        isStepperDisplayed={Boolean(form.values.type)}
      />
    </NewProposalContext.Provider>
  );
}

export const useNewProposalForm = () => useContext(NewProposalContext);

export default NewProposalForm;
