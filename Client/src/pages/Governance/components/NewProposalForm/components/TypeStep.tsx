import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useForm } from '@q-dev/form-hooks';
import { Icon, RadioGroup, Spinner, Tooltip } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

import { FormStep } from 'components/MultiStepForm';

import useProposalActionsInfo from 'hooks/useProposalActionsInfo';
import useProposalSteps from 'hooks/useProposalSteps';

import { useNewProposalForm } from '../NewProposalForm';

import { useDaoStore } from 'store/dao/hooks';
import { useProviderStore } from 'store/provider/hooks';

import { AVAILABLE_VOTING_SITUATIONS } from 'constants/proposal';
import { RoutePaths } from 'constants/routes';
import { required } from 'utils/validators';

const SpinnerWrap = styled.div`
  width: fit-content;
  margin: 60px auto;
`;

const RadioGroupLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
  width: 100%;

  .radio-group-label__tooltip {
    margin: 4px 0 auto;
  }
`;

interface ProposalPermissions {
  value: string;
  isComingSoon: boolean;
  isUserHasVotingPower: boolean;
  isUserMember: boolean;
}

function TypeStep ({ situations, panelName }: { situations: string[]; panelName: string }) {
  const { t } = useTranslation();
  const { composeDaoLink } = useDaoStore();
  const { currentProvider } = useProviderStore();
  const { goNext, onChange } = useNewProposalForm();
  const { proposalOptionsMap } = useProposalSteps();
  const { checkIsUserCanCreateProposal } = useProposalActionsInfo();
  const [proposalPermissions, setProposalPermissions] = useState<ProposalPermissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      type: '',
      panel: panelName
    },
    validators: {
      type: [required],
      panel: [required]
    },
    onChange,
    onSubmit: goNext,
  });

  const loadPermissions = async () => {
    setIsLoading(true);
    const availableProposals = situations.map(item => {
      const proposalStep = AVAILABLE_VOTING_SITUATIONS.find(el => el === item);
      return {
        value: proposalStep || item,
        isComingSoon: !proposalStep,
      };
    });
    const allPermissions = await Promise.all(availableProposals.map(async (item) => {
      const { isUserHasVotingPower, isUserMember } = await checkIsUserCanCreateProposal(panelName, item.value);
      return {
        isUserMember,
        isUserHasVotingPower,
        value: item.value,
        isComingSoon: item?.isComingSoon || false
      };
    }));
    setProposalPermissions(allPermissions);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPermissions();
  }, [panelName, situations]);

  useEffect(() => {
    if (proposalPermissions.length && currentProvider?.selectedAddress) {
      const proposal = proposalPermissions.find((i) =>
        !i.isComingSoon && i.isUserHasVotingPower && i.isUserMember
      );
      if (proposal) {
        form.fields.type.onChange(proposal.value);
      }
    }
  }, [proposalPermissions, panelName, currentProvider?.selectedAddress]);

  const options = proposalPermissions.map((item) => ({
    value: item.value,
    tip: item.isComingSoon ? t('COMING_SOON') : proposalOptionsMap[item.value].tip,
    disabled: item.isComingSoon || !item.isUserHasVotingPower || !item.isUserMember,
    label: item.isComingSoon
      ? item.value
      : (item.isUserHasVotingPower && item.isUserMember) || !currentProvider?.selectedAddress
        ? proposalOptionsMap[item.value].label
        : (
          <RadioGroupLabel key={item.value}>
            <span className="text-lg font-semibold">
              {proposalOptionsMap[item.value].label}
            </span>
            <Tooltip
              className="radio-group-label__tooltip"
              trigger={<Icon name="info" className="text-lg color-primary" />}
            >
              {item.isUserHasVotingPower
                ? t('NEED_MEMBER_STATUS')
                : <Trans
                  i18nKey="NEED_VOTING_POWER"
                  components={{
                    votingPowerLink: <NavLink
                      style={{ textDecoration: 'underline' }}
                      to={composeDaoLink(RoutePaths.votingPower)}
                    />
                  }}
                />
              }
            </Tooltip>
          </RadioGroupLabel>
        )
  }));

  if (isLoading) {
    return (
      <SpinnerWrap>
        <Spinner size={60} />
      </SpinnerWrap>
    );
  }

  return (
    <FormStep
      disabled={!form.isValid || isLoading || !form.values.type}
      onNext={form.submit}
    >
      <RadioGroup
        {...form.fields.type}
        extended
        name="type"
        options={options}
      />
    </FormStep>
  );
}

export default TypeStep;
