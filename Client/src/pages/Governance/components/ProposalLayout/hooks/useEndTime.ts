import { useTranslation } from 'react-i18next';

import { formatDate, formatDateRelative } from 'utils/date';

function useEndTime (date: Date) {
  const { t, i18n } = useTranslation();
  const endTimeText = date.getTime() > Date.now() ? t('ENDS') : t('ENDED');
  return {
    formatted: formatDate(date, i18n.language),
    relative: date.getTime()
      ? `${endTimeText} ${formatDateRelative(date, i18n.language)}`
      : '–',
  };
}

export default useEndTime;
