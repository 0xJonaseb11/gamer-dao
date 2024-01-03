import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@q-dev/q-ui-kit';
import { useInterval } from '@q-dev/react-hooks';

import CopyToClipboard from 'components/CopyToClipboard';

import useNetworkConfig from 'hooks/useNetworkConfig';

import packageJson from '../../../../../package.json';

import { VersionsContainer } from './styles';

import { formatDateGMT } from 'utils/date';

interface Props {
  open: boolean;
  onClose: () => void;
}

function VersionModal ({ open, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { rpcUrl, chainId } = useNetworkConfig();
  const [currentDate, setCurrentDate] = useState(new Date());

  useInterval(() => {
    setCurrentDate(new Date());
  }, 50000);

  const versionGroups = [
    {
      title: t('MAIN'),
      items: [
        {
          name: 'dApp',
          value: packageJson.version,
        },
        {
          name: t('YOUR_CURRENT_TIME'),
          value: formatDateGMT(currentDate, i18n.language),
        },
      ],
    },
    {
      title: t('MODULES'),
      items: [
        {
          name: 'ethers',
          value: packageJson.dependencies.ethers,
        },
        {
          name: 'Q.GDK SDK',
          value: packageJson.dependencies['@q-dev/gdk-sdk'],
        },
      ],
    },
    {
      title: t('DAO_CLIENT'),
      items: [
        {
          name: 'RPC URL',
          value: rpcUrl,
        },
        {
          name: t('NETWORK') + ' ID',
          value: chainId,
        },
      ],
    },
  ];

  return (
    <Modal
      open={open}
      title={t('VERSION_INFORMATION')}
      width={600}
      onClose={onClose}
    >
      <VersionsContainer>
        {versionGroups.map((group, i) => (
          <div key={String(i)} className="version-group">
            <h3 className="text-h3">{group.title}</h3>
            <div className="version-group-items">
              {group.items.map((item) => (
                <div key={item.name}>
                  <p className="text-md font-light">{item.name}</p>
                  {item.value
                    ? <div className="text-md">
                      <span>{item.value}</span>
                      <CopyToClipboard value={item.name + '-' + item.value} />
                    </div>
                    : <span className="text-md">{t('NO_INFO')}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </VersionsContainer>
    </Modal>
  );
}

export default VersionModal;
