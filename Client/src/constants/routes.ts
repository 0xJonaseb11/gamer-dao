export enum RoutePaths {
  dashboard = '/',

  governance = '/governance',
  governanceTab = '/governance/:tab?',
  proposal = '/governance/proposal/:contract?/:id?',
  newProposal = '/governance/proposals/new',

  parameters = '/parameters',
  contractRegistry = '/parameters/contract-registry',

  votingPower = '/voting-power',
}
