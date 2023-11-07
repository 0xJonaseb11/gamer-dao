import { useTranslation } from 'react-i18next';

import { DefaultVotingSituations } from '@q-dev/gdk-sdk';

function useProposalSteps () {
  const { t } = useTranslation();

  const proposalOptionsMap: Record<string, {label: string; tip: string}> = {
    [DefaultVotingSituations.Constitution]: {
      label: t('CONSTITUTION_UPDATE'),
      tip: t('CONSTITUTION_UPDATE_TIP')
    },
    [DefaultVotingSituations.General]: {
      label: t('GENERAL_Q_UPDATE'),
      tip: t('GENERAL_Q_UPDATE_TIP')
    },
    [DefaultVotingSituations.ConfigurationParameter]: {
      label: t('CONFIG_PARAMETER_VOTE'),
      tip: t('CONFIG_PARAMETER_VOTE_TIP')
    },
    [DefaultVotingSituations.RegularParameter]: {
      label: t('EXPERT_PARAMETER_VOTE'),
      tip: t('PARAMETER_VOTE_TIP')
    },
    [DefaultVotingSituations.Membership]: {
      label: t('MEMBERSHIP_VOTE'),
      tip: t('MEMBERSHIP_VOTE_TIP')
    },
    [DefaultVotingSituations.DAORegistry]: {
      label: t('DAO_REGISTRY_VOTE'),
      tip: t('DAO_REGISTRY_TIP')
    },
    AirDropV2: {
      label: "AirDropV2",
      tip: "AirDropV2"
    },
  };

  return { proposalOptionsMap };
}

export default useProposalSteps;
