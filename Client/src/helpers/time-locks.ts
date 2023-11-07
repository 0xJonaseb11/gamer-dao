
import { TimeLockEntry } from 'typings/dao';

import { TimeLockStatus } from 'constants/statuses';
import { unixToDate } from 'utils/date';

export function getLockStatus (lock: TimeLockEntry) {
  const startDate = unixToDate(lock.releaseStart.toString());
  const endDate = unixToDate(lock.releaseEnd.toString());

  if (startDate > new Date()) return TimeLockStatus.locked;
  if (endDate < new Date()) return TimeLockStatus.unlocked;
  return TimeLockStatus.unlocking;
};
