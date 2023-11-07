import { DefaultVotingSituations } from '@q-dev/gdk-sdk';

export const AVAILABLE_VOTING_SITUATIONS = Object.freeze([
  DefaultVotingSituations.Constitution,
  DefaultVotingSituations.General,
  DefaultVotingSituations.ConfigurationParameter,
  DefaultVotingSituations.RegularParameter,
  DefaultVotingSituations.Membership,
  DefaultVotingSituations.DAORegistry,
  "AirDropV2"
]);
