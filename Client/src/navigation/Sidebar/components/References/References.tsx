import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';

import { ReferencesContainer } from './styles';

import { useProviderStore } from 'store/provider/hooks';

import { networkConfigsMap } from 'constants/config';

function References () {
  const { t } = useTranslation();
  const { currentProvider } = useProviderStore();

  const referenceLinks = [
    {
      title: t('REPOSITORIES'),
      href: 'https://gitlab.com/q-dev/q-gdk',
    },
    {
      title: t('DOCUMENTATION'),
      href: 'https://docs.q-dao.tools',
    },
    ...(Number(currentProvider?.chainId) === networkConfigsMap.testnet.chainId
      ? [{
        title: t('Q_TESTNET_FAUCET'),
        href: 'https://faucet.qtestnet.org',
      }]
      : []
    )
  ];

  return (
    <ReferencesContainer>
      {referenceLinks.map(({ title, href }) => (
        <a
          key={href}
          className="reference-link text-md"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          <span className="reference-link-text">{title}</span>
          <Icon name="external-link" className="reference-link-icon" />
        </a>
      ))}
    </ReferencesContainer>
  );
}

export default References;
