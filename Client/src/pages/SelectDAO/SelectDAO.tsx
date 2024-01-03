import { useTranslation } from 'react-i18next';

import PageLayout from 'components/PageLayout';

import DaoAddressForm from './components/DaoAddressForm';
import DaosList from './components/DaosList';

function SelectDao () {
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t('DAOS_TITLE')}
    >
      <DaoAddressForm />
      <DaosList />
    </PageLayout>
  );
}

export default SelectDao;
