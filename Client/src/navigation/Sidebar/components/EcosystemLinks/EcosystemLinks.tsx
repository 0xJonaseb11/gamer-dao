
import { Icon } from '@q-dev/q-ui-kit';
import { IconName } from '@q-dev/q-ui-kit/dist/components/Icon';

import Button from 'components/Button';

import useNetworkConfig from 'hooks/useNetworkConfig';

import { LinksContainer } from './styles';

function EcosystemLinks () {
  const { qBridgeUrl, explorerUrl, gnosisSafeUrl } = useNetworkConfig();

  const links: { icon: IconName; href: string }[] = [
    { href: gnosisSafeUrl, icon: 'gnosis-safe' },
    { href: explorerUrl, icon: 'explorer' },
    { href: qBridgeUrl, icon: 'bridge' },
  ];

  return (
    <LinksContainer>
      {links.map(({ href, icon }) => (
        <a
          key={href}
          className="ecosystem-link"
          target="_blank"
          href={href}
          rel="noreferrer"
        >
          <Button
            block
            icon
            look="ghost"
          >
            <Icon name={icon} className="ecosystem-link-icon" />
          </Button>
        </a>
      ))}
    </LinksContainer>
  );
}

export default EcosystemLinks;
