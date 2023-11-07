import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';

import { formatUrl } from 'utils';
import { URL_REGEX } from 'utils/validators';

interface Props {
  remark: string;
}

function RemarkViewer ({ remark }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      {URL_REGEX.test(remark)
        ? (
          <>
            <a
              href={formatUrl(remark)}
              target="_blank"
              rel="noreferrer"
              className="link text-md"
              style={{ maxWidth: '100%' }}
            >
              <span className="ellipsis">{remark}</span>
              <Icon name="external-link" />
            </a>
            <p className="text-sm color-secondary">{t('PROPOSAL_LINK_DISCLAIMER')}</p>
          </>
        )
        : <p className="text-md pre-line">{remark || '–'}</p>
      }
    </div>
  );
}

export default RemarkViewer;
