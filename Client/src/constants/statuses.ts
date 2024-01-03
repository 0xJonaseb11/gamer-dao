export const TRANSACTION_TYPES = {
  success: 'Success',
  rejected: 'Rejected',
};

export const LOAD_TYPES = {
  error: 'error',
  loaded: 'loaded',
  loading: 'loading',
  initError: 'init-error',
  notLogged: 'not-logged',
  notInstalled: 'not-installed',
  wrongNetwork: 'wrong-network',
};

export enum TimeLockStatus {
  locked = 'locked',
  unlocking = 'unlocking',
  unlocked = 'unlocked',
}

export enum PROPOSAL_STATUS {
  none = 0,
  pending = 1,
  rejected = 2,
  accepted = 3,
  passed = 4,
  executed = 5,
  obsolete = 6,
  expired = 7
}
