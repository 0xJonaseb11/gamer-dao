import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dropdown, Icon } from '@q-dev/q-ui-kit';
import { trimString } from '@q-dev/utils';
import styled from 'styled-components';

import CopyToClipboard from 'components/CopyToClipboard';

import { useConstitution } from 'store/constitution/hooks';

import { formatDateDMY } from 'utils/date';

const StyledWrapper = styled.div`
  padding: 16px 16px 16px 24px;

  .constitution-block__menu {
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    display: grid;
    width: max-content;
    min-width: 156px;
    padding: 4px 0;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
    box-shadow:
      0 4px 4px ${({ theme }) => theme.colors.blockShadowDark},
      0 -1px 2px ${({ theme }) => theme.colors.blockShadowLight};
  }

  .constitution-block__menu-link {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    transition: background-color 100ms ease-out;

    &:hover {
      background-color: ${({ theme }) => theme.colors.tertiaryLight};
    }
  }

  .constitution-block__menu-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .constitution-block__hash {
    margin-top: 4px;
  }

  .constitution-block__date {
    margin-top: 16px;
  }
`;

function ConstitutionBlock () {
  const { t, i18n } = useTranslation();
  const {
    constitutionHash,
    constitutionLastUpdate,
    loadConstitutionHash,
    loadConstitutionLastUpdate
  } = useConstitution();

  const [menuOpen, setMenuOpen] = useState(false);

  async function loadConstitutionValues () {
    await loadConstitutionHash();
    await loadConstitutionLastUpdate();
  }

  useEffect(() => {
    loadConstitutionValues();
  }, []);

  return (
    <StyledWrapper className="block">
      <div className="block__header">
        <h2 className="text-lg">
          🔖 CONSTITUTION
        </h2>

        <Dropdown
          right
          open={menuOpen}
          trigger={(
            <Button
              icon
              className="constitution-block__menu-btn"
              look="ghost"
              active={menuOpen}
            >
              <Icon name="more-vertical" />
            </Button>
          )}
          onToggle={setMenuOpen}
        >
          <div className="constitution-block__menu">
            <a
              className="constitution-block__menu-link text-md"
            >
              <Icon name="download" />
              <span>{t('DOWNLOAD')}</span>
            </a>
          </div>
        </Dropdown>
      </div>

      <div className="constitution-block__hash text-xl font-semibold">
        <span>{trimString(constitutionHash)}</span>
        <CopyToClipboard value={constitutionHash} />
      </div>

      <p className="constitution-block__date text-sm font-light">
        {t('LAST_UPDATE', { date: constitutionLastUpdate ? formatDateDMY(constitutionLastUpdate, i18n.language) : '-' })}
      </p>
    </StyledWrapper>
  );
};

export default ConstitutionBlock;
